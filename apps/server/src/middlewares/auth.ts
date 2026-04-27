import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { User } from "../generated/prisma/client";
import { Errors, type AppError } from "@repo/shared/common";
import jwt from "jsonwebtoken";
import { env } from "@repo/shared/env/server";

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

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // 1. Get the token from the header
    // Standard format is: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // If there's no token at all
    if (!token) {
        console.log("NO Access Token. Unautharised");
        throw Errors.FORBIDDEN;
    }
    // 2. Verify the token
    jwt.verify(token, env.JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            console.error(err);
            // 3. Send specific error messages based on the failure
            const message =
                err.name === "TokenExpiredError"
                    ? "Token has expired"
                    : "Invalid token";

            return res.status(403).json({
                success: false,
                message: message,
            });
        }

        // 4. Verification successful!
        // Attach the user data (from the JWT payload) to the request
        req.user = decodedPayload as { userId: string };

        // Move to the next function in the route
        next();
    });
};
