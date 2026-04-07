import { z } from "zod";
import { USERNAME_REGEX } from "./constans";

export const registerUserReqSchema = z.object({
    username: z.string().regex(USERNAME_REGEX),
    password: z.string().min(8),
    publicKey: z.string(),
});

export const getUserReqSchema = z
    .object({
        userId: z.string().optional(),
        username: z.string().regex(USERNAME_REGEX).optional(),
    })
    .refine(
        (data) => data.userId === undefined || data.username === undefined,
        { error: "Either userId or username must be provided" },
    );

const RoleEnum = z.enum(["USER", "ADMIN"]); // Match your Prisma Role enum

export const UpdateUserReqSchema = z
    .object({
        userId: z.uuid().optional(),
        username: z.string().regex(USERNAME_REGEX).optional(),
        to_update: z
            .object({
                username: z.string().regex(USERNAME_REGEX).optional(),
                passwordHash: z.string().optional(),
                role: RoleEnum.optional(),
                publicKey: z.string().optional(),
                refreshToken: z.string().nullable().optional(),
            })
            .strict(), // .strict() ensures no extra fields are passed
    })
    .refine(
        (data) => data.userId !== undefined || data.username !== undefined,
        {
            message:
                "Either userId or username must be provided to identify the record",
            path: ["userId"],
        },
    )
    .refine((data) => Object.keys(data.to_update).length > 0, {
        message: "The to_update object cannot be empty",
        path: ["to_update"],
    });
