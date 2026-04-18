import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "./prisma";
import { Errors } from "@repo/shared/common";

export async function createMessage(
    roomId: string,
    senderId: string,
    cipherText: string,
    iv: string,
) {
    try {
        const [message] = await prisma.$transaction([
            prisma.message.create({
                data: {
                    roomId,
                    senderId,
                    cipherText,
                    iv,
                },
            }),
            prisma.room.update({
                where: { id: roomId },
                data: { lastMessageAt: new Date() },
            }),
        ]);
        return message;
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            switch (err.code) {
                case "P2025":
                    throw Errors.ROOM_NOT_FOUND; // room doesn't exist
                case "P2003":
                    throw Errors.USER_NOT_FOUND; // senderId FK violation
            }
        }
        throw err;
    }
}
