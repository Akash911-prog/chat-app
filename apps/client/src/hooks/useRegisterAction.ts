import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useKeyStore } from "../store/accessKey";
import { clientEnv } from "@repo/shared/env/client";
import { Errors } from "@repo/shared/common";
import { generateKeyPair, wrapKey, toBase64Safe } from "../libs/keyGeneration";
import { storePrivateKey } from "../libs/indexDbHelpers";
import type { registerUserForm } from "@repo/shared";

export const useRegisterAction = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const keyStore = useKeyStore();

    const handleRegister = async (data: registerUserForm) => {
        setIsSubmitting(true);

        try {
            // 1. Cryptography Setup
            const { publicKey, privateKey } = await generateKeyPair();
            const { encryptedPrivateKey, salt, iv } = await wrapKey(
                privateKey,
                data.password,
            );

            const exportedPublicKey = toBase64Safe(
                new Uint8Array(
                    await window.crypto.subtle.exportKey("raw", publicKey),
                ),
            );

            // 2. Register Request
            const regRes = await fetch(`${clientEnv.VITE_SERVER_URL}/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    publicKey: exportedPublicKey,
                    cipherText: encryptedPrivateKey,
                    iv,
                    salt,
                }),
            });

            if (!regRes.ok) throw new Error("Registration failed");
            const result = await regRes.json();

            // 3. Local Key Persistence (Non-Extractable)
            const nonExtractableKey = await crypto.subtle.importKey(
                "pkcs8",
                await crypto.subtle.exportKey("pkcs8", privateKey),
                { name: "ECDH", namedCurve: "P-256" },
                false,
                ["deriveKey", "deriveBits"],
            );
            await storePrivateKey(result.user.id, nonExtractableKey);

            // 4. Automatic Login
            const loginRes = await fetch(
                `${clientEnv.VITE_SERVER_URL}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        username: data.username,
                        password: data.password,
                    }),
                },
            );

            if (!loginRes.ok) throw Errors.INVALID_CREDENTIALS;

            const { accessToken } = await loginRes.json();
            keyStore.setAccessKey(accessToken);
            navigate({ to: "/" });
        } catch (error) {
            console.error(error);
            throw error; // Let the toast handler catch it
        } finally {
            setIsSubmitting(false);
        }
    };

    return { handleRegister, isSubmitting };
};
