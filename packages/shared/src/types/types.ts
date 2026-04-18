import { z } from "zod";
import {
    getUserReqSchema,
    registerUserReqSchema,
    UpdateUserReqSchema,
    createRoomSchema,
    sendMessageSchema,
    getMessagesSchema,
    loginUserFormSchema,
    registerUserFormSchema,
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
    usernameA: string;
    userBId: string;
    usernameB: string;
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

export interface RouterContext {
    user: PublicUser | null;
    auth: {
        isAuthenticated: () => Promise<boolean>;
    };
}

export type registerUserReq = z.infer<typeof registerUserReqSchema>;
export type getUserReq = z.infer<typeof getUserReqSchema>;
export type updateUserReq = z.infer<typeof UpdateUserReqSchema>;
export type createRoomReq = z.infer<typeof createRoomSchema>;
export type sendMessageReq = z.infer<typeof sendMessageSchema>;
export type getMessagesReq = z.infer<typeof getMessagesSchema>;
export type registerUserForm = z.infer<typeof registerUserFormSchema>;
export type loginUserForm = z.infer<typeof loginUserFormSchema>;
