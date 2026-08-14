import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const __DEV__ = process.env.NODE_ENV === "development";

// to use sqlite, run `pnpm i @prisma/adapter-better-sqlite3`
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({
  adapter,
  log: __DEV__ ? ["error", "error", "query", "warn"] : ["error"],
});

export default prisma;
