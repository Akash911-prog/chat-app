import { Server } from "socket.io";
import type { Server as httpServer } from "http";
import { env } from "@repo/shared/env/server";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";
import { catchSocket } from "./socket.error";
import { Errors } from "@repo/shared/common";
import { registerMessageHandlers } from "./handlers/messagesEvents";
import { createRoom } from "../libs/room.lib";

let io: Server;

export function initSocket(server: httpServer) {
    io = new Server(server, {
        cors: {
            origin: [env.VITE_API_URL],
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        try {
            const payload = jwt.verify(token, env.JWT_SECRET) as {
                userId: string;
            };
            socket.data.userId = payload.userId;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                next(new Error("EXPIRED"));
            } else if (error instanceof jwt.JsonWebTokenError) {
                next(new Error("UNAUTHERISED"));
            } else {
                next(new Error("INTERNAL"));
            }
        }
    });

    io.on("connection", async (socket) => {
        socket.data.rooms = new Set();

        socket.on(
            "join_room",
            catchSocket(
                socket,
                async (data: {
                    roomId: string;
                    userId: string;
                    username: string;
                    otherUserId: string;
                    otherUsername: string;
                }) => {
                    const roomExists = await prisma.room.count({
                        where: {
                            AND: [
                                { id: data.roomId },
                                {
                                    OR: [
                                        { userAId: data.userId },
                                        { userBId: data.userId },
                                    ],
                                },
                            ],
                        },
                    });

                    if (!roomExists) {
                        const room = await createRoom(
                            data.userId,
                            data.username,
                            data.otherUserId,
                            data.otherUsername,
                        );

                        data.roomId = room.id;
                    }

                    socket.data.rooms.add(data.roomId);
                    socket.join(data.roomId);
                },
            ),
        );

        registerMessageHandlers(socket);
    });

    return io;
}

export function getIO() {
    if (!io) throw new Error("SocketIo not initialized");
    return io;
}
