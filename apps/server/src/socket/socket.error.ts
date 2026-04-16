import { Socket } from "socket.io";
import { AppError } from "@repo/shared/common";

export function handleSocketError(socket: Socket, err: unknown) {
    if (err instanceof AppError) {
        return socket.emit("error", {
            message: err.message,
            code: err.code,
        });
    }
    console.error(err);
    socket.emit("error", {
        message: "Something went wrong",
        code: "INTERNAL",
    });
}

export function catchSocket(
    socket: Socket,
    handler: (...args: any[]) => Promise<void>,
) {
    return async (...args: any[]) => {
        try {
            await handler(...args);
        } catch (err) {
            handleSocketError(socket, err);
        }
    };
}
