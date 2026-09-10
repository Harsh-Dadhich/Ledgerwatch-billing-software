import os
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization

KEY_DIR = os.environ.get("KEY_DIR", "keys")
PRIVATE_KEY_PATH = os.path.join(KEY_DIR, "server_private_key.pem")


def _generate_and_save() -> ec.EllipticCurvePrivateKey:
    os.makedirs(KEY_DIR, exist_ok=True)
    private_key = ec.generate_private_key(ec.SECP256R1())
    with open(PRIVATE_KEY_PATH, "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption(),
        ))
    return private_key


def _load_or_create() -> ec.EllipticCurvePrivateKey:
    pem_env = os.environ.get("SERVER_EC_PRIVATE_KEY_PEM")
    if pem_env:
        pem_env = pem_env.strip().strip('"').strip("'")
        # Support both real newlines (preferred) and literal \n escapes,
        # in case the platform's env editor collapses line breaks.
        if "\\n" in pem_env and "\n" not in pem_env:
            pem_env = pem_env.replace("\\n", "\n")
        return serialization.load_pem_private_key(pem_env.encode(), password=None)

    if os.path.exists(PRIVATE_KEY_PATH):
        with open(PRIVATE_KEY_PATH, "rb") as f:
            return serialization.load_pem_private_key(f.read(), password=None)

    return _generate_and_save()


server_private_key = _load_or_create()
server_public_pem = server_private_key.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo,
).decode()