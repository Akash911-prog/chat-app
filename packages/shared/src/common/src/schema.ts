import { z } from "zod";
import { USERNAME_REGEX } from "./constans";

export const registerUserReqSchema = z.object({
    username: z.string().regex(USERNAME_REGEX),
    password: z.string().min(8),
    publicKey: z.string(),
    cipherText: z.string(),
    salt: z.string(),
    iv: z.string(),
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

export const createRoomSchema = z.object({
    creatorId: z.uuid(),
    recipientId: z.uuid(),
});

export const sendMessageSchema = z.object({
    roomId: z.uuid(),
    senderId: z.uuid(),
    cipherText: z.string(),
    iv: z.string(),
});

export const getMessagesSchema = z.object({
    roomId: z.uuid(),
    take: z.number().optional().default(50),
    cursor: z.string().optional(), // For pagination
});

export const registerUserFormSchema = z
    .object({
        username: z
            .string()
            .min(1, { error: "username is required" })
            .regex(USERNAME_REGEX, { error: "only a-z, 0-9 and _ allowed" }),
        password: z
            .string()
            .min(1, { error: "password required" })
            .min(8, { error: "atleast 8 characters needed" }),
        confirmPassword: z
            .string()
            .min(1, { error: "password required" })
            .min(8, { error: "atleast 8 characters needed" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Confirmed password does not match the given password",
        path: ["password", "confirmPassword"],
    });

export const loginUserFormSchema = z.object({
    username: z
        .string()
        .min(1, { error: "username is required" })
        .regex(USERNAME_REGEX, { error: "only a-z, 0-9 and _ allowed" }),
    password: z
        .string()
        .min(1, { error: "password required" })
        .min(8, { error: "atleast 8 characters needed" }),
});
