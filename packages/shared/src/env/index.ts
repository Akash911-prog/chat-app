import dotenv from "dotenv";
import { z } from "zod";

console.log(process.cwd());
dotenv.config({ path: "../../.env" });

const schema = z.object({
    // shared
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    APP_NAME: z.string(),
    DATABASE_URL: z.url(),

    // server
    PORT: z.coerce.number().default(3001),
    JWT_SECRET: z.string().min(32),

    // client (optional on server side)
    VITE_API_URL: z.url().optional(),
    // VITE_APP_TITLE: z.string().optional(),
});

function parseEnv() {
    const result = schema.safeParse(process.env);

    if (!result.success) {
        console.error("❌ Invalid environment variables:");
        result.error.issues.forEach((issue) => {
            console.error(`  ${issue.path.join(".")} — ${issue.message}`);
        });
        process.exit(1);
    }

    return result.data;
}

export const env = parseEnv();

export type Env = z.infer<typeof schema>;
