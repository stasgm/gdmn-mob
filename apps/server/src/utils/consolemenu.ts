import inquirer from 'inquirer';

export const consoleMenu = async (): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'db',
        message: 'Выберите базу:',
        choices: ['DB_Agents', 'DB_OTVES', 'DB_INVENTORY'],
        filter: function (val) {
          return val.toUpperCase();
        },
      },
    ])
    .then((answers) => {
      return JSON.stringify(answers, null, '  ');
    })
    .catch((error) => {
      if (error.isTtyError) {
        return 'Prompt couldnt be rendered in the current environment';
      } else {
        return 'Something else went wrong';
      }
    });
};
