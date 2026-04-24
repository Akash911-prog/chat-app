import { clientEnv } from "@repo/shared/env/client";
import { useRoomStore } from "../store/room";
import { apiFetch } from "./fetch";
import type { PublicRoom } from "@repo/shared";

export async function fetchChats() {
    const roomStore = useRoomStore.getState();
    try {
        const response = await apiFetch(
            `${clientEnv.VITE_SERVER_URL}/chat/room`,
        );

        if (!response.ok) {
            return;
        }

        const data = (await response.json()) as {
            userId: string;
            rooms: PublicRoom[];
        };

        console.log(data);
        roomStore.setRooms(data.rooms);
        return;
    } catch (error) {
        console.log(error);
    }
}
