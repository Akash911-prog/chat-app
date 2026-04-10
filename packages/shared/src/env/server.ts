import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

const schema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    APP_NAME: z.string(),
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3001),
    JWT_SECRET: z.string().min(32),
    VITE_API_URL: z.url(),
});

const result = schema.safeParse(process.env);
if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.issues.forEach((issue) => {
        console.error(`  ${issue.path.join(".")} — ${issue.message}`);
    });
    process.exit(1);
}

export const env = result.data;
export type Env = typeof result.data;
