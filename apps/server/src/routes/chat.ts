import { Router } from "express";
import { authenticateToken } from "../middlewares/auth";
import { getMessages, getRooms } from "../handlers/chatHandler";
import { validateSchema } from "../middlewares/validateZodSchema";
import { getMessagesSchema } from "@repo/shared/common";

const router = Router();

router.use(authenticateToken);

router.get("/message", validateSchema(getMessagesSchema), getMessages);

router.get("/room", getRooms);

export default router;
