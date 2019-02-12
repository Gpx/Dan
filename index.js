#!/usr/bin/env node

const inquirer = require("inquirer");
const camelCase = require("lodash.camelcase");
const upperFirst = require("lodash.upperfirst");
const flow = require("lodash.flow");

async function makeComponent() {
  inquirer.prompt([
    {
      type: "confirm",
      name: "isGlobal",
      message: "Is this going to be a global component?",
      default: false
    },
    {
      type: "input",
      name: "name",
      message: "What name do you want to give to your component?",
      validate: name =>
        name.trim().length === 0 ? "Name can't be empty" : true,
      filter: name => flow([camelCase, upperFirst])(name)
    },
    {
      type: "confirm",
      name: "storybook",
      message: ({ name }) =>
        `Would you like to create a storybook for ${name}?`,
      when: ({ isGlobal }) => !isGlobal
    },
    {
      type: "confirm",
      name: "confirm",
      message: "I'm going to create the following files is that OK?\nfoo\n"
    }
  ]);
}

async function main() {
  console.log("Hi! I'm Dan. I create stuff for React projects.");
  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want me to create?",
      choices: ["Component"]
    }
  ]);

  switch (type) {
    case "Component":
      makeComponent();
  }
}

main();

/*
 * component
 * - is it global?
 *   y -> app/components
 *   n -> what path?
 *        - app/{path}/components/{componentName}/
 * state/context
 * screen
 * api
 * utils -> utils/{utilName}/
 * hooks
 * - is it global?
 *   y -> app/hooks
 *   n -> what path?
 *        - app/{path}/hooks/{hookName}/
 * type/fabricator
 */
