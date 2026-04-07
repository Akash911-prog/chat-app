import type {
    getUserReq,
    PublicUser,
    registerUserReq,
    updateUserReq,
} from "@repo/shared";
import type { Response, Request } from "express";
import { prisma } from "../libs/prisma";
import { Errors, SALT_ROUNDS } from "@repo/shared/common";
import bcrypt from "bcrypt";
import { Prisma } from "../generated/prisma/client";

export async function createUser(req: Request, res: Response) {
    const data = req.body as registerUserReq;
    const existingUser = await prisma.user.findUnique({
        where: {
            username: data.username,
        },
    });

    if (existingUser) throw Errors.USERNAME_TAKEN;

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            username: data.username,
            passwordHash: hashedPassword,
            publicKey: data.publicKey,
        },
    });

    if (!user) throw Errors.INTERNAL;

    return res.status(200).json({ success: true, user });
}

export async function getUser(req: Request, res: Response) {
    const data = req.body as getUserReq;

    let user;
    if (data.userId) {
        user = await prisma.user.findUnique({
            where: {
                id: data.userId,
            },
        });
    } else if (data.username) {
        user = await prisma.user.findUnique({
            where: {
                username: data.username,
            },
        });
    }

    if (!user) throw Errors.USER_NOT_FOUND;

    const { passwordHash, refreshToken, ...publicUser } = user;

    return res
        .status(200)
        .json({ success: true, user: publicUser as PublicUser });
}

export async function deleteUser(req: Request, res: Response) {
    const data = req.body as getUserReq;

    let user;

    try {
        user = prisma.user.delete({
            where: data.userId
                ? { id: data.userId }
                : { username: data.username },
        });
    } catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2025"
        ) {
            throw Errors.USER_NOT_FOUND;
        } else {
            console.log("[deleteUser]: ", err);
            throw Errors.INTERNAL;
        }
    }

    return res.status(200).json({ success: true });
}

export async function updateUser(req: Request, res: Response) {
    const data = req.body as updateUserReq;

    let user;

    try {
        user = await prisma.user.update({
            where: data.userId
                ? { id: data.userId }
                : { username: data.username },
            // This spreads all fields from to_update (username, role, etc.) into the query
            data: data.to_update,
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                throw Errors.USER_NOT_FOUND;
            } else if ((err.code = "P2002")) {
                throw Errors.USERNAME_TAKEN;
            } else {
                console.log("[update User]: ", err);
                throw Errors.INTERNAL;
            }
        }
    }

    res.status(200).json({ user });
}
