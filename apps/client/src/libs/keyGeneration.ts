export async function generateKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        true, // Must be true if you want to export the keys later
        ["deriveKey", "deriveBits"], // Intended uses for these keys
    );

    return keyPair; // Returns { publicKey: CryptoKey, privateKey: CryptoKey }
}

export function stringToArrayBuffer(str: string) {
    const buffer = new TextEncoder().encode(str).buffer;
    return buffer;
}

export async function digest(message: string) {
    const data = stringToArrayBuffer(message);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return hash;
}

export const arrayBufferToHexString = (buffer: ArrayBuffer) => {
    const byteArray = new Uint8Array(buffer);
    const hexCodes = [...byteArray].map((value) => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, "0");
        return paddedHexCode;
    });

    return hexCodes.join("");
};

// utils/encoding.ts (in your client or shared/common)
export const toBase64 = (bytes: Uint8Array): string =>
    btoa(String.fromCharCode(...bytes));

export const fromBase64 = (b64: string): Uint8Array =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export const getKeyFromPassword = async (
    password: string,
    salt: Uint8Array<ArrayBuffer>,
) => {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"],
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 210000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["wrapKey", "unwrapKey"],
    );
};

export const toBase64Safe = (bytes: Uint8Array): string => {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

export async function wrapKey(privateKey: CryptoKey, password: string) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const wrappingKey = await getKeyFromPassword(password, salt);

    const wrapped = await crypto.subtle.wrapKey(
        "pkcs8",
        privateKey,
        wrappingKey,
        { name: "AES-GCM", iv },
    );

    return {
        encryptedPrivateKey: toBase64Safe(new Uint8Array(wrapped)),
        salt: toBase64(salt),
        iv: toBase64(iv),
    };
}

export async function unwrapPrivateKey(
    encryptedPrivateKey: string,
    password: string,
    saltB64: string,
    ivB64: string,
): Promise<CryptoKey> {
    const salt = fromBase64(saltB64) as Uint8Array<ArrayBuffer>;
    const iv = fromBase64(ivB64) as Uint8Array<ArrayBuffer>;
    const wrappedKey = fromBase64(
        encryptedPrivateKey,
    ) as Uint8Array<ArrayBuffer>;

    const wrappingKey = await getKeyFromPassword(password, salt);

    return crypto.subtle.unwrapKey(
        "pkcs8",
        wrappedKey,
        wrappingKey,
        { name: "AES-GCM", iv },
        { name: "ECDH", namedCurve: "P-256" },
        false, // extractable: false straight away
        ["deriveKey", "deriveBits"],
    );
}
