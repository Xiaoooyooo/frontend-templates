#!/bin/env node
import url from "url";
import path from "path";
import fs from "fs/promises";
import readline from "readline/promises";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function question(question) {
  const instance = readline.createInterface(process.stdin, process.stdout);
  const ans = await instance.question(question);
  instance.close();
  return ans;
}

async function createPackageJSON(dirname) {
  const type = await (async () => {
    const ans = await question(`选择模块类型：

    1. CommonJS
    2. ES Modules
`);
    if (ans.trim() === "1") return "commonjs";
    return "module";
  })();
  const description = (await question("请输入描述信息：")).trim();
  const template = {
    name: "project-name-placeholder",
    version: "1.0.0",
    description,
    main: "",
    scripts: {},
    keywords: [],
    author: "",
    license: "ISC",
    type,
  };
  const json = JSON.stringify(template, null, 2);
  await fs.writeFile(path.resolve(__dirname, dirname, "package.json"), json);
}

async function main() {
  const templateName = (await question("请输入模板名称：")).trim();
  if (!templateName) {
    console.log("Template name is required!");
    process.exit(1);
  }
  try {
    const stat = await fs.stat(templateName);
    if (!stat.isDirectory()) {
      console.log("目标路径已存在，且不是一个文件夹！");
      process.exit(1);
    }
    const files = await fs.readdir(templateName);
    if (files.length !== 0) {
      console.log("目标文件夹不为空！");
      process.exit(1);
    }
  } catch (error) {
    // dir is not exists
    await fs.mkdir(templateName);
  }
  await createPackageJSON(templateName);
}

main();
