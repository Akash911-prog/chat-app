import type { Request, Response } from "express";
import { prisma } from "../libs/prisma";
import { Errors } from "@repo/shared/common";
import type { getMessagesReq } from "@repo/shared";

export async function getRooms(req: Request, res: Response) {
    const payload = req.user as { userId: string };

    const rooms = await prisma.room.findMany({
        where: {
            OR: [{ userAId: payload.userId }, { userBId: payload.userId }],
        },
        orderBy: {
            lastMessageAt: "desc",
        },
    });

    // findMany returns [] not null — throw only if you want to treat no rooms as an error,
    // but typically an empty list is a valid response
    if (rooms.length === 0) {
        return res.status(200).json({ userId: payload.userId, rooms: [] });
    }

    return res.status(200).json({
        userId: payload.userId,
        rooms,
    });
}

export async function getMessages(req: Request, res: Response) {
    const payload = req.user as { userId: string };
    const body = req.body as getMessagesReq;

    // Fix: check that the user belongs to the specific room
    const exists = await prisma.room.count({
        where: {
            id: body.roomId,
            OR: [{ userAId: payload.userId }, { userBId: payload.userId }],
        },
    });
    if (!exists) throw Errors.ROOM_NOT_FOUND;

    if (!body.cursor) {
        const messages = await prisma.message.findMany({
            take: body.limit,
            skip: 0,
            where: {
                roomId: body.roomId,
            },
            orderBy: [
                { sentAt: "asc" },
                { id: "asc" }, // stable tiebreaker
            ],
        });

        // findMany returns [] not null, so check length instead
        if (messages.length === 0) {
            return res.status(200).json({ messages: [], next: null });
        }

        return res.status(200).json({
            messages,
            // only provide a cursor if there might be more results
            next:
                messages.length === body.limit
                    ? messages[messages.length - 1].id
                    : null,
        });
    }

    const messages = await prisma.message.findMany({
        take: body.limit,
        skip: 1,
        where: {
            roomId: body.roomId,
        },
        cursor: {
            id: body.cursor?.id,
        },
        orderBy: [{ sentAt: "asc" }, { id: "asc" }],
    });

    if (messages.length === 0) {
        return res.status(200).json({ messages: [], next: null });
    }

    return res.status(200).json({
        messages,
        next:
            messages.length === body.limit
                ? messages[messages.length - 1].id
                : null,
    });
}
