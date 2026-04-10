import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "@repo/shared/env/server";

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
    log: [
        { level: "warn", emit: "event" },
        { level: "info", emit: "event" },
        { level: "error", emit: "event" },
    ],
    errorFormat: "pretty",
});

prisma.$on("warn", (e) => console.log(e));
prisma.$on("info", (e) => console.log(e));
prisma.$on("error", (e) => console.log(e));
