import { env } from "@repo/shared/env";
import express from "express";
import cors, { type CorsOptions } from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";

// routes
import authRouter from "./routes/auth";

const app = express();

// cors
const corsOptions: CorsOptions = {
    origin: env.VITE_API_URL,
};
app.use(cors(corsOptions));

// security policy
app.use(helmet());

//rate limit
express.json({ limit: "10kb" });
const apiLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

app.use(apiLimit);

app.get("/", (req, res) => {
    res.send("server running...");
});

app.get("/health", (req, res) => {
    res.send({ status: "ok" });
});

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
});
