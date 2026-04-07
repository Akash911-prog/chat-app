import { Router } from "express";
import { login, refresh } from "../handlers/authHandles";
import { localAuth } from "../middlewares/auth";

const router = Router();

router.get("/", (req, res) => {
    res.send("This is the auth route");
});

router.post("/login", localAuth, login);

router.get("/refresh", refresh);

export default router;
