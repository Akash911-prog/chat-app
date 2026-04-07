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

const router = Router();

router.get("/", validateSchema(getUserReqSchema), getUser);

router.post("/", validateSchema(registerUserReqSchema), createUser);

router.delete("/", validateSchema(getUserReqSchema), deleteUser);

router.patch("/", validateSchema(UpdateUserReqSchema), updateUser);

export default router;
