import { Router } from "express";
import { validateSchema } from "../middlewares/validateZodSchema";
import { registerDataSchema } from "@repo/shared/common";
import { login, refresh, register } from "../handlers/authHandles";
import { localAuth } from "../middlewares/auth";

const router = Router();

router.get("/", (req, res) => {
    res.send("This is the auth route");
});

router.post("/register", validateSchema(registerDataSchema), register);

router.post("/login", localAuth, login);

router.get("/refresh", refresh);

export default router;
