import passport from "passport";
import { Strategy as LocalStratergy } from "passport-local";
import { Strategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import { prisma } from "../libs/prisma";
import { Errors } from "@repo/shared/common";
import { env } from "@repo/shared/env";

passport.use(
    "local",
    new LocalStratergy(async function verify(username, password, done) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
            if (!user) return done(null, false, Errors.USER_NOT_FOUND);

            const match = bcrypt.compare(password, user.passwordHash);
            if (!match) return done(null, false, Errors.INVALID_CREDENTIALS);

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }),
);

passport.use(
    "jwt",
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET,
        },
        async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: payload.userId,
                    },
                });
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        },
    ),
);

export default passport;
