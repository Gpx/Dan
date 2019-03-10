const inquirer = require("inquirer");
const camelCase = require("lodash.camelcase");
const trim = require("lodash.trim");
const flow = require("lodash.flow");
const fs = require("fs");
const chalk = require("chalk");

function newHookStructure({ name }) {
  return `
  src/app/hooks/${chalk.green(name + "/")}
                ├── ${chalk.green("index.js")}
                ├── ${chalk.green(name + ".test.js")}
                └── ${chalk.green(name + ".js")}
`;
}

module.exports = async function makeHook() {
  const { confirm, name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What name do you want to give to your Hook?",
      validate: name => {
        if (name.length === 0) return "Name can't be empty";
        if (!/^use[A-Z].*$/.test(name))
          return "Hooks must be in the form `use<Something>`";
        return true;
      },
      filter: name => flow([trim, camelCase])(name)
    },
    {
      type: "confirm",
      name: "confirm",
      message: answers =>
        `I'm going to create the following files is that OK?${newHookStructure(
          answers
        )}`
    }
  ]);
  if (!confirm) return;
  fs.mkdirSync(`./src/app/hooks/${name}`, { recursive: true });
  fs.writeFileSync(
    `./src/app/hooks/${name}/index.js`,
    `// @flow
export { default } from './${name}'`
  );
  fs.writeFileSync(
    `./src/app/hooks/${name}/${name}.js`,
    `// @flow

export default function ${name}() {
  // return what is needed here
}`
  );
  fs.writeFileSync(
    `./src/app/hooks/${name}/${name}.test.js`,
    `import { renderHook } from 'react-hooks-testing-library'
import ${name} from './${name}'

describe('${name}()', () => {
  it('CHANGE THIS DESCRIPTION!!!', () => {
    const { result } = renderHook(() => ${name}())
    expect(result.current).toBe('What you expect it to be')
  })
})`
  );
  console.log(chalk.green("Done!"));
};
