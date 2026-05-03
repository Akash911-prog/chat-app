import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useKeyStore } from "../store/accessKey";
import { clientEnv } from "@repo/shared/env/client";
import { Errors } from "@repo/shared/common";
import { unwrapPrivateKey } from "../libs/keyGeneration";
import { getPrivateKey, storePrivateKey } from "../libs/indexDbHelpers";
import type { loginUserForm } from "@repo/shared";
import { router } from "../main";

export const useLoginAction = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const keyStore = useKeyStore();

    const handleLogin = async (data: loginUserForm) => {
        setIsSubmitting(true);

        try {
            // 1. Authenticate with Server
            const res = await fetch(`${clientEnv.VITE_SERVER_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (!res.ok) throw Errors.INVALID_CREDENTIALS;

            const { accessToken, cipher, iv, salt, user } = await res.json();

            // 2. Set Access Token in State
            keyStore.setAccessKey(accessToken);

            // 3. Cryptography: Reconstruct the Private Key locally
            const privateKey = await unwrapPrivateKey(
                cipher,
                data.password,
                salt,
                iv,
            );

            // 4. Persistence: Ensure the key is in IndexedDB for this session/device
            const existing = await getPrivateKey(user.id);
            if (!existing) {
                await storePrivateKey(user.id, privateKey);
            }

            router.options.context.user = user;

            // 5. Success
            navigate({ to: "/" });
        } catch (error) {
            console.error("Login Error:", error);
            throw error; // Rethrow so customToast captures it
        } finally {
            setIsSubmitting(false);
        }
    };

    return { handleLogin, isSubmitting };
};
