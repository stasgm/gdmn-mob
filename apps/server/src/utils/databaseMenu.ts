import inquirer from 'inquirer';

import log from './logger';

export interface IItemDatabase {
  name: string;
  path: string;
  port: number;
}

interface IItemAnswer {
  db: string;
}

export const databaseMenu = async (dataBases: IItemDatabase[] | undefined): Promise<string | undefined> => {
  if (!dataBases) return undefined;
  if (dataBases.length === 1) return JSON.stringify(dataBases[0], null, '  ');

  const choiseArray = dataBases.map((i) => i.name);
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'db',
        message: 'Выберите базу:',
        choices: choiseArray,
        filter: function (val: string) {
          return val.toUpperCase();
        },
      },
    ])
    .then((answers: IItemAnswer) => {
      const answerDB = answers.db;
      const db = dataBases.find((i) => i.name.toUpperCase() === answerDB.toUpperCase());

      if (!db) {
        throw new Error('DB is not found');
      }

      log.info(`Working database path: ${db.path}\\.${db.name}`);

      return JSON.stringify(db, null, '  ');
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("Prompt couldn't be rendered in the current environment");
        return undefined;
      } else {
        console.log('Something else went wrong');
        return undefined;
      }
    });
};
