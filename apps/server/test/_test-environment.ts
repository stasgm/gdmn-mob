import Koa from 'koa';

import { IActivationCode } from '../../common';

import run from '../src';
import { writeFile } from '../src/utils/workWithFile';

/* import {
  PATH_LOCAL_DB_USERS,
  PATH_LOCAL_DB_DEVICES,
  PATH_LOCAL_DB_COMPANIES,
  PATH_LOCAL_DB_ACTIVATION_CODES,
  PATH_LOCAL_DB_MESSAGES,
} from '../src/server'; */

let app: Koa<Koa.DefaultState, Koa.DefaultContext> | null = null;

export async function initEnvironment(): Promise<void> {
  app = await run();
  const today = new Date();

  const users = [
    {
      id: 'admin',
      userName: 'admin',
      password: 'admin',
      firstName: 'admin',
      creatorId: 'admin',
      companies: ['com', 'org'],
    },
    {
      id: '1',
      userName: '1',
      password: '1',
      firstName: '1',
      lastName: '1',
      phoneNumber: '1',
      creatorId: 'admin',
      companies: ['com', 'fir'],
    },
    { id: '2', userName: '2', password: '2', creatorId: 'admin', companies: ['com'] },
  ];
  const devices = [
    { uid: '123', user: 'admin', blocked: false },
    { uid: '123', user: '1', blocked: false },
    { uid: 'asd', user: '1', blocked: false },
    { uid: 'qwe', user: 'admin', blocked: true },
  ];
  const companies = [
    { id: 'com', title: 'com', admin: 'admin' },
    { id: 'org', title: 'org', admin: 'admin' },
    { id: 'fir', title: 'fir', admin: '1' },
  ];
  const activationCodes: IActivationCode[] = [
    {
      code: '123qwe',
      deviceId: '',
      date: new Date(today.setDate(today.getDate() - 1)).toLocaleDateString(),
    },
    {
      code: 'asd456',
      deviceId: '',
      date: new Date(today.setDate(today.getDate() - 10)).toLocaleDateString(),
    },
  ];
  const messages4Com = {
    head: {
      id: '4945c0bf-0436-46ad-a9c2-669cc33330a9',
      consumer: 'gdmn',
      producer: '2',
      dateTime: '2020-02-21T13:27:41.609Z',
    },
    body: {
      type: 'cmd',
      payload: { name: 'get_references', params: ['documenttypes', 'goodgroups', 'goods', 'remains', 'contacts'] },
    },
  };
  const messages4org = {
    head: {
      id: '88895370-5ebf-47de-858d-2d8ef3933328',
      consumer: '2',
      producer: 'gdmn',
      dateTime: '2020-02-21T13:16:32.987Z',
    },
    body: {
      type: 'data',
      payload: [
        {
          name: 'documenttypes',
          data: [
            { id: '147027952', name: '01. Накладная на получение товара' },
            { id: '157974921', name: 'Переучёт' },
          ],
        },
        {
          name: 'goodgroups',
          data: [
            { id: '147002743', name: 'ВСЕ ТМЦ' },
            { id: '147002748', name: 'Стеклопосуда' },
            { id: '147048678', name: 'Базовый товар' },
          ],
        },
        {
          name: 'goods',
          data: [
            {
              id: '150641675',
              name: 'Кефир 3,2% ппк с крышкой 0,5кг Беларусь',
              alias: '',
              barcode: '4810272003304',
              value: 'шт.',
            },
            {
              id: '147090034',
              name: 'Сливки порц. для кофе Campina 10х10г 10% Бельгия',
              alias: '',
              barcode: '4820023749115',
              value: 'уп.',
            },
          ],
        },
        {
          name: 'remains',
          data: [
            { goodId: '147090034', contactId: '147072136', price: '6,6', quantity: '8' },
            { goodId: '150641675', contactId: '147072136', price: '3,3', quantity: '7' },
            { goodId: '147090034', contactId: '147072138', price: '1,5', quantity: '99' },
            { goodId: '147090034', contactId: '147072138', price: '6,6', quantity: '16' },
            { goodId: '150641675', contactId: '147072138', price: '0,78', quantity: '24' },
            { goodId: '150641675', contactId: '147072138', price: '3,3', quantity: '15' },
            { goodId: '150218636', contactId: '147072138', price: '8', quantity: '9' },
          ],
        },
        {
          name: 'contacts',
          data: [
            { type: '4', id: '147072138', name: 'Склад продуктов' },
            { type: '4', id: '147424778', name: 'Кухня 3' },
            { type: '4', id: '147619187', name: 'Лоток' },
            { type: '4', id: '147613665', name: 'Кафе 2' },
          ],
        },
      ],
    },
  };

  /* await writeFile({ filename: PATH_LOCAL_DB_USERS, data: JSON.stringify(users) });
  await writeFile({ filename: PATH_LOCAL_DB_DEVICES, data: JSON.stringify(devices) });
  await writeFile({ filename: PATH_LOCAL_DB_COMPANIES, data: JSON.stringify(companies) });
  await writeFile({ filename: PATH_LOCAL_DB_ACTIVATION_CODES, data: JSON.stringify(activationCodes) });
  await writeFile({
    filename: `${PATH_LOCAL_DB_MESSAGES}\\com\\4945c0bf-0436-46ad-a9c2-669cc33330a9.json`,
    data: JSON.stringify(messages4Com),
  });
  await writeFile({
    filename: `${PATH_LOCAL_DB_MESSAGES}\\org\\88895370-5ebf-47de-858d-2d8ef3933328.json`,
    data: JSON.stringify(messages4org),
  }); */
}

export function getApp(): Koa<Koa.DefaultState, Koa.DefaultContext> {
  if (!app) {
    throw new Error('Environment is not initialized');
  }
  return app;
}
