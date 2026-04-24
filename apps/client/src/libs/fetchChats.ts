import { clientEnv } from "@repo/shared/env/client";
import { useRoomStore } from "../store/room";
import { apiFetch } from "./fetch";
import type { PublicRoom, Room } from "@repo/shared";

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

        const rooms: Room[] = data.rooms.map((elem) => {
            return {
                id: elem.id,
                userId:
                    elem.userAId === data.userId ? elem.userBId : elem.userBId,
                username:
                    elem.userAId === data.userId
                        ? elem.usernameB
                        : elem.usernameA,
                lastMessageAt: elem.lastMessageAt,
                createdAt: elem.createdAt,
            } as Room;
        });

        roomStore.setRooms(rooms);
        return;
    } catch (error) {
        console.log(error);
    }
}
