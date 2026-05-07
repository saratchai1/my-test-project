import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function prepareServerlessSqliteDemo() {
  if (process.env.VERCEL !== "1") return;
  const target = "/tmp/ieat-ai-digital-twin-demo.db";
  if (!existsSync(target)) {
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(process.cwd(), "prisma/dev.db"), target);
  }
  process.env.DATABASE_URL = `file:${target}`;
}

prepareServerlessSqliteDemo();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
