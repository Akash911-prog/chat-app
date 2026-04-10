import { Router } from "express";
import { validateSchema } from "../middlewares/validateZodSchema";
import {
    createUser,
    deleteUser,
    getUser,
    updateUser,
} from "../handlers/userHandler";
import {
    getUserReqSchema,
    registerUserReqSchema,
    UpdateUserReqSchema,
} from "@repo/shared/common";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/", validateSchema(registerUserReqSchema), createUser);

router.use(authenticateToken);

router.get("/", validateSchema(getUserReqSchema), getUser);

router.delete("/", validateSchema(getUserReqSchema), deleteUser);

router.patch("/", validateSchema(UpdateUserReqSchema), updateUser);

export default router;
