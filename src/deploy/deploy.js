import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--folder': String,
      '--skip': Boolean,

      '--gh-pages': Boolean,
      '--firebase': Boolean,

      '-s': '--skip',
      '-g': '--gh-pages',
      '-f': '--firebase',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    ghPages: args['--gh-pages'] || false,
    firebase: args['--firebase'] || false,

    folder: args['--folder'] || null,
    skipPrompts: args['--skip'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.ghPages || !options.firebase) {
    questions.push({
      type: 'list',
      name: 'host',
      message: 'Deployment target :',
      choices: [
        'Github Pages',
        'FireBase'
      ]/* ,
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one topping.';
        }

        return true;
      }, */
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    git: options.git || answers.git,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  console.log(options);
}
