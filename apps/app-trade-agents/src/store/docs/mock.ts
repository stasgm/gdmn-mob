import { v4 as uuid } from 'uuid';

import { IOrderDocument, IRouteDocument } from './types';

export const documentData: IOrderDocument[] = [
  {
    id: uuid(),
    number: '225',
    documentDate: '25.04.2021',
    documentType: { id: uuid(), name: 'Заявка1 (организация)' },
    status: {
      type: 'DRAFT',
      errorMessage: '',
    },
    head: {
      contact: { id: uuid(), name: 'ОАО "Веста" г.Витебск' },
      outlet: { id: uuid(), name: 'ОАО "Веста" г.Витебск, магазин №82' },
      ondate: '25.04.2021',
    },
    lines: [
      { id: uuid(), good: { id: uuid(), name: 'Сосиски докторские' }, quantity: 12 },
      { id: uuid(), good: { id: uuid(), name: 'К-са вар. из м/птицы "Свислочская" в/с' }, quantity: 10 },
    ],
  },
  {
    id: uuid(),
    number: '226',
    documentDate: '25.04.2021',
    documentType: { id: uuid(), name: 'Заявка1 (организация)' },
    status: {
      type: 'DRAFT',
      errorMessage: '',
    },
    head: {
      contact: { id: uuid(), name: 'ОАО "Веста" г.Витебск' },
      outlet: { id: uuid(), name: 'ОАО "Веста" г. Витебск маг.№61 ул.К.Маркса,15' },
      ondate: '25.04.2021',
    },
    lines: [
      { id: uuid(), good: { id: uuid(), name: 'С-ки вар. из м/птицы "Боярские" в/с (газ)' }, quantity: 3 },
      {
        id: uuid(),
        good: { id: uuid(), name: 'Пр. из св. к/в "Буженинка "Фаворит" (вакуум, трансп. уп)' },
        quantity: 1.2,
      },
      { id: uuid(), good: { id: uuid(), name: 'К-ки в/к сал. "Кабаноссы с сыром" 1с (газ)' }, quantity: 8 },
    ],
  },
  {
    id: uuid(),
    number: '227',
    documentDate: '25.04.2021',
    documentType: { id: uuid(), name: 'Заявка1 (организация)' },
    status: {
      type: 'DRAFT',
      errorMessage: '',
    },
    head: {
      contact: { id: uuid(), name: 'ЧТУП "Сионград"' },
      outlet: { id: uuid(), name: 'Сионград 31 ЧТУП "Сионград" Бобруйский район' },
      ondate: '25.04.2021',
    },
    lines: [
      {
        id: uuid(),
        good: { id: uuid(), name: 'Пр. из св. к/в "Буженинка "Фаворит" (вакуум, трансп. уп)' },
        quantity: 7.3,
      },
      { id: uuid(), good: { id: uuid(), name: 'Пр. из св. к/в Ребра "Селянские" (газ)' }, quantity: 4 },
      { id: uuid(), good: { id: uuid(), name: 'Сосиски докторские' }, quantity: 12 },
    ],
  },
  {
    id: uuid(),
    number: '228',
    documentDate: '25.04.2021',
    documentType: { id: uuid(), name: 'Заявка1 (организация)' },
    status: {
      type: 'DRAFT',
      errorMessage: '',
    },
    head: {
      contact: { id: uuid(), name: 'ЧУТПП "Батя" г.п.Ушачи' },
      outlet: { id: uuid(), name: 'ЧУТПП "Батя" магазин "Батя" г.п.Ушачи' },
      ondate: '25.04.2021',
    },
    lines: [
      { id: uuid(), good: { id: uuid(), name: 'Пр. из св. к/в Ребра "Селянские" (газ)' }, quantity: 8.32 },
      { id: uuid(), good: { id: uuid(), name: 'Мяс.п/ф в тес.зам.Пельмени "Знатные новые" кат.В вес.' }, quantity: 9 },
      { id: uuid(), good: { id: uuid(), name: 'Консервы мясные из св."Свинина тушеная пряная" 338 г' }, quantity: 45 },
    ],
  },
];
//  Route
export const documenRouteData: IRouteDocument[] = [
  {
    id: '30506',
    number: '34',
    documentDate: '9579457',
    documentType: {
      id: '33',
      name: 'route',
    },
    status: {
      type: 'DRAFT',
      errorMessage: '',
    },
    head: {
      agent: {
        id: '111111',
        name: 'петров',
      },
    },
    lines: [
      {
        id: '468',
        outlet: {
          id: '5839',
          name: 'рога и копыта маг № 89',
        },
        ordNumber: 3,
        visited: true,
      },
    ],
  },
];
