import { z } from "zod";

const schema = z.object({
    VITE_API_URL: z.url(),
    VITE_SERVER_URL: z.url(),
    MODE: z.enum(["development", "production", "test"]).default("development"),
});

const result = schema.safeParse(import.meta.env);
if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.issues.forEach((issue) => {
        console.error(`  ${issue.path.join(".")} — ${issue.message}`);
    });
    throw new Error("Invalid client environment variables");
}

export const clientEnv = result.data;
export type ClientEnv = typeof result.data;
