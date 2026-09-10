import base64
import json

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import HTTPException, status
import os

from app.auth.payload import EncryptedRequest
from app.core.keys import server_private_key

SALT = b"\x00" * 16
INFO = b"encryption-key"


def decrypt_request(encrypted_req: EncryptedRequest) -> tuple[dict, bytes]:
    try:
        client_public_bytes = base64.b64decode(encrypted_req.ephemeral_public_key)
        client_public_key = ec.EllipticCurvePublicKey.from_encoded_point(
            ec.SECP256R1(), client_public_bytes,
        )
        shared_secret = server_private_key.exchange(ec.ECDH(), client_public_key)
        aes_key = HKDF(
            algorithm=hashes.SHA256(), length=32, salt=SALT, info=INFO,
        ).derive(shared_secret)

        aesgcm = AESGCM(aes_key)
        plaintext = aesgcm.decrypt(
            base64.b64decode(encrypted_req.iv),
            base64.b64decode(encrypted_req.ciphertext),
            None,
        )
        return json.loads(plaintext.decode("utf-8")), aes_key

    except (InvalidTag, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted encrypted payload",
        )


def encrypt_response(data: dict, aes_key: bytes) -> dict:
    iv = os.urandom(12)
    aesgcm = AESGCM(aes_key)
    ciphertext = aesgcm.encrypt(iv, json.dumps(data).encode("utf-8"), None)
    return {
        "ciphertext": base64.b64encode(ciphertext).decode(),
        "iv": base64.b64encode(iv).decode(),
    }