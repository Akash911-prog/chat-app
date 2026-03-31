import { z } from "zod";
import { USERNAME_REGEX } from "./constans";

export const registerDataSchema = z.object({
    username: z.string().regex(USERNAME_REGEX),
    password: z.string().min(8),
    publicKey: z.string(),
});
