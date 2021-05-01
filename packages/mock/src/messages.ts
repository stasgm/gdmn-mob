import { ICompany, IMessage, INamedEntity, NewMessage } from '@lib/types';
import { v4 as uuid } from 'uuid';

const user1: INamedEntity = {
  id: '123',
  name: 'Stas',
};

const user2: INamedEntity = {
  id: '345',
  name: 'Ina',
};

const user3: INamedEntity = {
  id: '654',
  name: 'Gedemin',
};

const companies: ICompany[] = [
  { id: '789', name: 'ОДО Золотые Программы', admin: user1 },
  { id: '654', name: 'ОДО Амперсант', admin: user2 },
  { id: uuid(), name: 'Company 1', admin: user2 },
  { id: uuid(), name: 'Company 2', admin: user2 },
  { id: uuid(), name: 'Company 3', admin: user1 },
  { id: uuid(), name: 'Company 4', admin: user2 },
];

export const newMessage: NewMessage<string> = {
  head: {
    appSystem: 'Inventory',
    company: companies[0],
    consumer: user1,
  },
  body: {
    type: 'cmd',
    payload: 'get documents',
  },
};

export const messages: IMessage<string>[] = [
  {
    id: '14',
    head: {
      appSystem: 'Inventory',
      company: companies[0],
      producer: user3,
      consumer: user1,
      dateTime: '2021-04-15T10:47:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get documents',
    },
  },
  {
    id: '19',
    head: {
      appSystem: 'Inventory',
      company: companies[0],
      producer: user3,
      consumer: user1,
      dateTime: '2021-04-21T10:52:33.376Z',
    },
    body: {
      type: 'data',
      payload: 'Reference: goods',
    },
  },
  {
    id: '21',
    head: {
      appSystem: 'Inventory',
      company: companies[0],
      producer: user3,
      consumer: user1,
      dateTime: '2021-04-21T18:03:33.376Z',
    },
    body: {
      type: 'data',
      payload: 'Documents',
    },
  },
  {
    id: '35',
    head: {
      appSystem: 'Inventory',
      company: companies[0],
      producer: user2,
      consumer: user3,
      dateTime: '2021-04-25T09:21:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get references',
    },
  },
  {
    id: '48',
    head: {
      appSystem: 'Inventory',
      company: companies[0],
      producer: user3,
      consumer: user2,
      dateTime: '2021-04-28T14:10:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get references, documents',
    },
  },
];
