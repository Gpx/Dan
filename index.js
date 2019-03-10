#!/usr/bin/env node

const inquirer = require("inquirer");
const makeHook = require("./lib/makeHook");
const makeUtilFunction = require("./lib/makeUtilFunction");

async function main() {
  console.log("Hi! I'm Dan. I create stuff for React projects.");
  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want me to create?",
      choices: ["Hook", "Util Function"]
    }
  ]);

  switch (type) {
    case "Hook":
      makeHook();
      break;
    case "Util Function":
      makeUtilFunction();
      break;
  }
}

main();
