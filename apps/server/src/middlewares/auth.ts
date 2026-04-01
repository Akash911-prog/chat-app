import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { User } from "../generated/prisma/client";
import type { AppError } from "@repo/shared/common";

export async function localAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    passport.authenticate(
        "local",
        { session: false },
        (err: Error | null, user: User | boolean, info: AppError) => {
            if (err) return next(err);

            if (!user) return next(info);

            req.user = user as User;
            next();
        },
    )(req, res, next);
}
