import type { Socket } from "socket.io";
import { createMessage } from "../../libs/messages.lib";
import { Errors } from "@repo/shared/common";
import { catchSocket } from "../socket.error";
import { getIO } from "..";

async function message(
    socket: Socket,
    roomId: string,
    senderId: string,
    cipherText: string,
    iv: string,
) {
    const message = await createMessage(roomId, senderId, cipherText, iv);

    if (!message) throw Errors.INTERNAL;

    getIO().to(roomId).emit("message_received_server", socket.data.userId);
}

export function registerMessageHandlers(socket: Socket) {
    socket.on(
        "message_sent",
        catchSocket(
            socket,
            async (data: {
                roomId: string;
                cipherText: string;
                iv: string;
            }) => {
                await message(
                    socket,
                    data.roomId,
                    socket.data.userId,
                    data.cipherText,
                    data.iv,
                );
            },
        ),
    );

    socket.on(
        "message_recieved_client",
        catchSocket(socket, async (roomId: string) => {
            socket.to(roomId).emit("message_recieved");
        }),
    );

    socket.on(
        "message_seen_client",
        catchSocket(socket, async (roomId: string) => {
            socket.to(roomId).emit("message_seen");
        }),
    );
}
