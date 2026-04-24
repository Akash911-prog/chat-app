import { env } from "@repo/shared/env/server";
import express from "express";
import cors, { type CorsOptions } from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import "./config/passport";
import passport from "passport";
import { createServer } from "http";

// routes
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import chatRouter from "./routes/chat";
import { initSocket } from "./socket";

const app = express();

// cors
const corsOptions: CorsOptions = {
    origin: [
        "http://localhost:5173",
        "http://192.168.0.101:5173",
        "http://127.0.0.1:5173",
    ],
    credentials: true,
};
app.use(cors(corsOptions));

// security policy
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                "upgrade-insecure-requests": null,
            },
        },
    }),
);
app.use(cookieParser());
//rate limit
app.use(express.json({ limit: "10kb" }));
const apiLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

app.use(apiLimit);

app.use(passport.initialize());

app.get("/", (req, res) => {
    res.send("server running...");
});

app.get("/health", (req, res) => {
    res.send({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);

app.use(errorHandler);

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
});
