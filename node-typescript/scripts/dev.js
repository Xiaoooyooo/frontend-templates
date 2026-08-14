import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const distRoot = path.resolve(import.meta.dirname, "../dist");
const entry = path.resolve(distRoot, "app/main.js");

fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(distRoot, { recursive: true });

const builder = spawn(
  "npx",
  ["tsc", "--project", "tsconfig.app.json", "--watch"],
  {
    shell: true,
    env: process.env,
  },
);

const watcher = fs.watch(
  distRoot,
  { recursive: true },
  debounce((eventType, filename) => {
    console.log(eventType, filename);
    if (eventType === "change") {
      start();
    }
  }, 500),
);

/**
 * @type {import("child_process").ChildProcess | null}
 */
let server = null;

let restarting = false;

function run() {
  if (!fs.existsSync(entry) || !fs.statSync(entry).isFile()) {
    return;
  }
  console.clear();
  server = spawn("node", [entry], {
    stdio: "inherit",
  });
}

function start() {
  if (restarting) {
    return;
  }
  if (server && server.exitCode === null && server.signalCode === null) {
    console.log("检测到文件变化，重启服务...");
    restarting = true;
    const onExit = () => {
      restarting = false;
      server = null;
      run();
    };
    server.once("exit", onExit);
    if (!server.kill("SIGKILL")) {
      server.removeListener("exit", onExit);
      onExit();
    }
  } else {
    server = null;
    run();
  }
}

/**
 * @param {(...args: any[]) => void} fn
 * @param {number} delay
 * @returns {(...args: any[]) => void}
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function exit() {
  console.log("receive exit signal, exiting...");
  server?.kill("SIGKILL");
  builder.kill("SIGKILL");
  watcher.close();
}

process.on("SIGINT", exit);
process.on("SIGTERM", exit);
