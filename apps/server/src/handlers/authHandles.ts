import type { Request, Response } from "express";
import type { User } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { env } from "@repo/shared/env";
import { Errors } from "@repo/shared/common";
import { prisma } from "../libs/prisma";

function generateToken(user: User) {
    const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response) {
    try {
        const user = req.user as User;

        const { accessToken, refreshToken } = generateToken(user);

        const decoded = jwt.decode(refreshToken) as { exp: number };
        const refreshTokenDb = await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(decoded.exp * 1000),
            },
        });

        res.cookie("refreshToken", refreshToken + "." + refreshTokenDb.id, {
            httpOnly: true,
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error("[login]: ", error);
        throw Errors.INTERNAL;
    }
}

export async function refresh(req: Request, res: Response) {
    const refreshTokenWithId: string = req.cookies.refreshToken;
    const [refreshToken, refreshTokenId] = refreshTokenWithId.split(".");
    console.log(refreshToken, refreshTokenId);
}

export async function register(req: Request, res: Response) {
    const data = req.body;
}
