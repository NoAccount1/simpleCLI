import arg from 'arg';
import inquirer from 'inquirer';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--folder': String,

      '--gh-pages': Boolean,
      '--firebase': Boolean,
      '--git': Boolean,

      '-g': '--gh-pages',
      '-f': '--firebase',
      '-g': '--git',

      '--yes': Boolean,
      '-y': '--yes',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    ghPages: args['--gh-pages'] || false,
    firebase: args['--firebase'] || false,

    folder: args['--folder'] || null,
    git: args['--git'] || false,

    skipPrompts: args['--yes'] || false,
    template: args._[0],
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
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate,
    });
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  console.log(options);
 }