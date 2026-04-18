import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "./prisma";
import { Errors } from "@repo/shared/common";

export async function createRoom(
    userId: string,
    username: string,
    otherUserId: string,
    otherUsername: string,
) {
    // decide userA/B by lexical order so [A,B] and [B,A] always produce the same row
    const [userAId, userAUsername, userBId, userBUsername] =
        userId < otherUserId
            ? [userId, username, otherUserId, otherUsername]
            : [otherUserId, otherUsername, userId, username];

    try {
        const room = await prisma.room.create({
            data: {
                userAId,
                userBId,
                usernameA: userAUsername,
                usernameB: userBUsername,
            },
        });
        return room;
    } catch (err) {
        if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === "P2002"
        ) {
            throw Errors.ROOM_ALREADY_EXISTS;
        }
        throw err;
    }
}
