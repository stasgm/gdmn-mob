import { IMessage, TNewMessage } from '@lib/types';

const companies = [
  { id: '1', name: 'My Company' },
  { id: '2', name: 'Company 1' },
];
const users = [
  { id: '1', name: 'Lena' },
  { id: '2', name: 'Stas' },
  { id: '3', name: 'Inna' },
  { id: '4', name: 'Gedemin' },
];

export const newMessage: TNewMessage<string> = {
  head: {
    appSystem: 'Inventory',
    company: companies[0],
    consumer: users[3],
  },
  body: {
    type: 'cmd',
    payload: 'get documents',
  },
};

export const data: IMessage<string>[] = [
  {
    id: '14',
    head: {
      appSystem: 'Inventory',
      company: companies[0],
      producer: users[0],
      consumer: users[3],
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
      producer: users[3],
      consumer: users[2],
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
      producer: users[3],
      consumer: users[1],
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
      producer: users[1],
      consumer: users[3],
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
      producer: users[2],
      consumer: users[3],
      dateTime: '2021-04-28T14:10:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get references, documents',
    },
  },
];
