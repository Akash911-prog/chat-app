import { z } from "zod";
import {
    getUserReqSchema,
    registerUserReqSchema,
    UpdateUserReqSchema,
} from "../common/src/schema";

export type PublicUser = {
    id: string;
    username: string;
    role: "USER" | "ADMIN";
    publicKey: string;
    createdAt: Date;
};

export type PublicRoom = {
    id: string;
    userAId: string;
    userBId: string;
    createdAt: Date;
};

export type PublicMessage = {
    id: string;
    roomId: string;
    senderId: string;
    cipherText: string;
    iv: string;
    sentAt: Date;
};

export type registerUserReq = z.infer<typeof registerUserReqSchema>;
export type getUserReq = z.infer<typeof getUserReqSchema>;
export type updateUserReq = z.infer<typeof UpdateUserReqSchema>;
