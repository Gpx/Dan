const inquirer = require("inquirer");
const camelCase = require("lodash.camelcase");
const trim = require("lodash.trim");
const flow = require("lodash.flow");
const chalk = require("chalk");
const fs = require("fs");

function newUtilFunctionStructure({ name }) {
  return `
  src/app/utils/${chalk.green(name + "/")}
                ├── ${chalk.green("index.js")}
                ├── ${chalk.green(name + ".test.js")}
                └── ${chalk.green(name + ".js")}
`;
}

module.exports = async function makeUtilFunction() {
  const { confirm, name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What name do you want to give to your util function?",
      validate: name => {
        if (name.length === 0) return "Name can't be empty";
        return true;
      },
      filter: name => flow([trim, camelCase])(name)
    },
    {
      type: "confirm",
      name: "confirm",
      message: answers =>
        `I'm going to create the following files is that OK?${newUtilFunctionStructure(
          answers
        )}`
    }
  ]);
  if (!confirm) return;
  fs.mkdirSync(`./src/app/utils/${name}`, { recursive: true });
  fs.writeFileSync(
    `./src/app/utils/${name}/index.js`,
    `// @flow
export { default } from './${name}'`
  );
  fs.writeFileSync(
    `./src/app/utils/${name}/${name}.js`,
    `// @flow

export default function ${name}() {
  // return what is needed here
}`
  );
  fs.writeFileSync(
    `./src/app/utils/${name}/${name}.test.js`,
    `import ${name} from './${name}'

describe('${name}()', () => {
  it('CHANGE THIS DESCRIPTION!!!', () => {
    const value = ${name}()
    expect(value).toBe('What you expect it to be')
  })
})`
  );
  console.log(chalk.green("Done!"));
};
