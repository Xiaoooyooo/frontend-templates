#!/bin/env node
const fs = require("fs");
const path = require("path");

const DIRNAME =
  path.sep === "\\"
    ? __dirname
        .split(path.sep)
        .join(path.posix.sep)
        .replace(/^[^/]+/, "")
    : __dirname;

const Template = process.argv[2];
let output = "";

/** @type {{test: RegExp; ignore?: boolean; out?: (filename: string) => string}[]} */
const Handlers = [
  {
    test: /[/\\]node_modules[\\/]/,
    ignore: true,
  },
  {
    test: /(template|pnpm-lock\.yaml)$/,
    ignore: true,
  },
  {
    // next
    test: /(\.next|next-env\.d\.ts)/,
    ignore: true
  },
  {
    test: /tsconfig\.node\.tsbuildinfo/,
    ignore: true
  }
];

const DefaultOut = (filename) =>
  filename.replace(resolvePath(Template) + "/", "");

function resolvePath(...paths) {
  return path.posix.resolve(DIRNAME, ...paths);
}

/**
 * @param {string} path
 * @returns {Promise<string[]>}
 */
function readDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, async (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function isDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

function isFile(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isFile());
      }
    });
  });
}

async function writeFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function handleDirectory(path) {
  const files = await readDirectory(resolvePath(path));
  for (const filename of files) {
    const fullpath = resolvePath(path, filename);
    const handler = Handlers.find((item) => item.test.test(fullpath));
    if (handler?.ignore) {
      continue;
    }
    if (await isFile(fullpath)) {
      if (!handler) {
        output += DefaultOut(fullpath) + "\n";
      } else {
        output += (handler.out || DefaultOut)(fullpath);
      }
    } else {
      await handleDirectory(fullpath);
    }
  }
}

async function main() {
  const files = await readDirectory(DIRNAME);
  /** @type {string[]} */
  const templates = [];
  for (const filename of files) {
    if (!/^\./.test(filename) && (await isDirectory(resolvePath(filename)))) {
      templates.push(filename);
    }
  }
  if (!templates.includes(Template)) {
    console.error(`Invalid template name: ${Template}`);
    process.exit(1);
  }
  await handleDirectory(Template);
  await writeFile(resolvePath(Template, "template"), output);
}

main();
