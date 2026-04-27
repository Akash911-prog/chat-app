import { clientEnv } from "@repo/shared/env/client";
import { useKeyStore } from "../store/accessKey";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const keyStore = useKeyStore.getState();

    // 1. Attach the current Access Token
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${keyStore.accessKey}`,
        "Content-Type": "application/json",
    };

    let response = await fetch(url, { ...options, headers });

    // 2. Catch the 403 Forbidden (or 401, depending on your backend)
    if (response.status === 403) {
        try {
            // 3. Attempt to refresh the token
            // Assuming your backend reads the Refresh Token from an httpOnly cookie
            const refreshRes = await fetch(
                `${clientEnv.VITE_SERVER_URL}/auth/refresh`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                const newKey = data.accessToken;

                // 4. Update Zustand
                keyStore.setAccessKey(newKey);

                // 5. Retry the original request with the NEW token
                headers["Authorization"] = `Bearer ${newKey}`;
                response = await fetch(url, { ...options, headers });
            } else {
                // Refresh token expired or invalid
                keyStore.logout();
            }
        } catch (err) {
            console.log(err);
            keyStore.logout();
        }
    }

    return response;
};
