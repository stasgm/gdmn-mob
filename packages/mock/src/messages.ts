import { ICompany, IDocument, IMessage, INamedEntity, IReferences, NewMessage } from '@lib/types';

// import { companyRefMock, depRefMock, docTypeRefMock, peopleRefMock, goodsRefMock } from './references';

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
  { id: '1', name: 'ОДО Золотые Программы', admin: user1 },
  { id: '2', name: 'ОДО Амперсант', admin: user2 },
  { id: '3', name: 'Company 1', admin: user2 },
  { id: '4', name: 'Company 2', admin: user2 },
  { id: '5', name: 'Company 3', admin: user1 },
  { id: '6', name: 'Company 4', admin: user2 },
];

export const newMessage: NewMessage<string> = {
  head: {
    appSystem: 'Inventory',
    company: companies[0] as INamedEntity,
    consumer: user1,
  },
  status: 'recd',
  body: {
    type: 'cmd',
    payload: 'get documents',
  },
};

//export const messages: Omit<IMessage<string>, 'status'>[] = [
export const messages: IMessage<string | IDocument[] | IReferences[]>[] = [
  {
    id: '14',
    status: 'recd',
    head: {
      appSystem: 'Inventory',
      company: companies[0] as INamedEntity,
      producer: user3,
      consumer: user1,
      dateTime: '2021-04-15T10:47:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get documents',
    },
  },
];

/* {
    id: '14',
    status: 'recd',
    head: {
      appSystem: 'Inventory',
      company: companies[0] as INamedEntity,
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
    status: 'recd',
    head: {
      appSystem: 'Inventory',
      company: companies[0] as INamedEntity,
      consumer: user3,
      producer: user1,
      dateTime: '2021-04-21T10:52:33.376Z',
    },
    body: {
      type: 'refs',
      payload: {
        goodsRefMock,
        depRefMock,
        peopleRefMock,
        companyRefMock,
        docTypeRefMock,
      },
    },
  },
  {
    id: '21',
    status: 'recd',
    head: {
      appSystem: 'Inventory',
      company: companies[0] as INamedEntity,
      consumer: user3,
      producer: user1,
      dateTime: '2021-04-21T18:03:33.376Z',
    },
    body: {
      type: 'docs',
      payload: [
        {
          id: '222',
          number: '1',
          documentType: {
            id: '154',
            name: 'Заявка',
          },
          documentDate: '2021-04-25T09:21:33.376Z',
          status: 'DRAFT',
        },
        {
          id: '333',
          number: '2',
          documentType: {
            id: '154',
            name: 'Заявка',
          },
          documentDate: '2021-04-30T09:20:13.376Z',
          status: 'READY',
        },
      ],
    },
  },
  {
    id: '35',
    status: 'recd',
    head: {
      appSystem: 'Inventory',
      company: companies[0] as INamedEntity,
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
    status: 'recd',
    head: {
      appSystem: 'Inventory',
      company: companies[0] as INamedEntity,
      producer: user3,
      consumer: user2,
      dateTime: '2021-04-28T14:10:33.376Z',
    },
    body: {
      type: 'cmd',
      payload: 'get references, documents',
    },
  },
];*/
