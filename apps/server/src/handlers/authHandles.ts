import type { Request, Response } from "express";
import type { User } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import { env } from "@repo/shared/env/server";
import { Errors } from "@repo/shared/common";
import { prisma } from "../libs/prisma";
import { randomBytes } from "crypto";

function generateToken(user: User, refreshTokenId: string) {
    const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
        { userId: user.id, refreshTokenId: refreshTokenId },
        env.JWT_SECRET,
        {
            expiresIn: "7d",
        },
    );

    return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response) {
    try {
        const user = req.user as User;

        const refreshTokenHash = randomBytes(32).toString("hex");

        const refreshTokenDb = await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshTokenHash,
            },
        });

        const { accessToken, refreshToken } = generateToken(
            user,
            refreshTokenDb.id,
        );

        const decoded = jwt.decode(refreshToken) as { exp: number };

        await prisma.refreshToken.update({
            where: { id: refreshTokenDb.id },
            data: { expiresAt: new Date(decoded.exp * 1000) },
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
        });

        res.status(200).json({
            accessToken,
            cipher: user.cipher,
            salt: user.salt,
            iv: user.iv,
            id: user.id,
        });
    } catch (error) {
        console.error("[login]: ", error);
        throw Errors.INTERNAL;
    }
}

export async function refresh(req: Request, res: Response) {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) throw Errors.UNAUTHORIZED;

    let payload;

    try {
        payload = jwt.verify(refreshToken, env.JWT_SECRET) as {
            refreshTokenId: string;
            userId: string;
            exp: number;
        };
        // token is valid
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.log("[refresh] Expired refresh token provided");
            throw Errors.UNAUTHORIZED;
        }
        if (err instanceof jwt.JsonWebTokenError) {
            console.log("[refresh] Invalid Refresh Token provided");
            throw Errors.UNAUTHORIZED;
        }
    }

    if (!payload) throw Errors.UNAUTHORIZED;

    const refreshTokenDb = await prisma.refreshToken.findUnique({
        where: {
            id: payload.refreshTokenId,
        },
    });

    if (!refreshTokenDb) throw Errors.NOT_FOUND;

    if (!refreshTokenDb.expiresAt) throw Errors.UNAUTHORIZED;

    if (new Date(Date.now()) > refreshTokenDb.expiresAt) {
        console.log("[refresh] Expired refresh Token Provided");
        throw Errors.UNAUTHORIZED;
    }
}

export async function logout(req: Request, res: Response) {
    const refreshToken: string = req.cookies.refreshToken;
    try {
        const payload = jwt.verify(refreshToken, env.JWT_SECRET) as {
            refreshTokenId: string;
            userId: string;
            exp: number;
        };

        await prisma.refreshToken.deleteMany({
            where: {
                id: payload.refreshTokenId,
            },
        });

        res.status(200).json({ success: true });
        // token is valid
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.log("[refresh] Expired refresh token provided");
            throw Errors.UNAUTHORIZED;
        }
        if (err instanceof jwt.JsonWebTokenError) {
            console.log("[refresh] Invalid Refresh Token provided");
            throw Errors.UNAUTHORIZED;
        } else {
            throw err;
        }
    }
}
