import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let envDir = import.meta.dirname;

while (true) {
  try {
    const envPath = path.join(envDir, ".env");
    const stats = fs.statSync(envPath);
    if (stats.isFile()) {
      dotenv.config({ path: envPath });
      break;
    }
    throw new Error(
      `No .env file found at ${envDir}, looking up parent directories`,
    );
  } catch {
    let oldEnvDir = envDir;
    envDir = path.resolve(envDir, "..");
    // 检查是否已经到达根目录
    if (oldEnvDir === envDir) {
      throw new Error("No .env file found");
    }
  }
}
