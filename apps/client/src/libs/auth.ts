import { clientEnv } from "@repo/shared/env/client";
import { useKeyStore } from "../store/accessKey";

export async function isAuthenticated(): Promise<boolean> {
    const keyStore = useKeyStore.getState();

    if (!keyStore.accessKey) {
        const res = await fetch(`${clientEnv.VITE_SERVER_URL}/auth/refresh`, {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok && res.status === 401) {
            return false;
        } else if (!res.ok) {
            return false;
        }

        keyStore.setAccessKey((await res.json()).accessKey);
    }
    return true;
}
