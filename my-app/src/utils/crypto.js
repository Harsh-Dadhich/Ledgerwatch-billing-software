const SALT = new Uint8Array(16); // matches backend: b"\x00" * 16
const INFO = new TextEncoder().encode("encryption-key");

function b64ToBuf(b64) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
function bufToB64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

async function importServerPublicKeyFromPem(pem) {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");
  return crypto.subtle.importKey(
    "spki",
    b64ToBuf(b64),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
}

async function deriveAesKey(serverPublicKey, clientPrivateKey) {
  const sharedBits = await crypto.subtle.deriveBits(
    { name: "ECDH", public: serverPublicKey },
    clientPrivateKey,
    256
  );
  const hkdfKey = await crypto.subtle.importKey("raw", sharedBits, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: SALT, info: INFO },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// encryptedRequestFn: pass in the `request` helper from client.js so this
// stays consistent with how the rest of the app talks to the API.
export async function encryptedLogin(request, payload) {
  const { public_key } = await request("/auth/public-key");
  const serverPublicKey = await importServerPublicKeyFromPem(public_key);

  const clientKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );
  const ephemeralPubRaw = await crypto.subtle.exportKey("raw", clientKeyPair.publicKey);
  const aesKey = await deriveAesKey(serverPublicKey, clientKeyPair.privateKey);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, plaintext);

  const encryptedBody = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      ciphertext: bufToB64(ciphertext),
      iv: bufToB64(iv),
      ephemeral_public_key: bufToB64(ephemeralPubRaw),
    }),
  });

  const resPlaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBuf(encryptedBody.iv) },
    aesKey,
    b64ToBuf(encryptedBody.ciphertext)
  );
  return JSON.parse(new TextDecoder().decode(resPlaintext)); // same UserOut shape as before
}