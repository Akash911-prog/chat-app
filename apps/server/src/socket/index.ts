import { Server } from "socket.io";
import type { Server as httpServer } from "http";
import { env } from "@repo/shared/env/server";
import jwt from "jsonwebtoken";

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
            const payload = jwt.verify(token, env.JWT_SECRET);
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

    io.on("connection", (socket) => {
        const roomId = socket.handshake.auth.roomId as string;
        socket.join(roomId);
    });

    return io;
}

export function getIO() {
    if (!io) throw new Error("SocketIo not initialized");
    return io;
}
