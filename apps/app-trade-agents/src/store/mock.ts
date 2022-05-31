import { companies, user, user2 } from '@lib/mock';
import { IAppSystem, IMessage, INamedEntity, MessageType } from '@lib/types';

import { ISellBill } from './types';

export const mockSellBills: ISellBill[] = [
  {
    id: '1246759230',
    number: '1448516',
    contract: { id: '165934057', name: '53 от 2013-12-10' },
    depart: { id: '323658854', name: 'Магазин-склад' },
    documentdate: new Date().toISOString(),
    quantity: 4.9511,
    price: 5.35,
  },
  {
    id: '1215293118',
    number: '5376518',
    contract: { id: '165934057', name: '53 от 2013-12-10' },
    depart: { id: '323658854', name: 'Магазин-склад' },
    documentdate: new Date().toISOString(),
    quantity: 5.25,
    price: 6.12,
  },
  {
    id: '1308039951',
    number: '1453027',
    contract: { id: '165934057', name: '53 от 2013-12-10' },
    depart: { id: '323658854', name: 'Магазин-склад' },
    documentdate: new Date().toISOString(),
    quantity: 6.4,
    price: 6.12,
  },
  {
    id: '1334757495',
    number: '5947875',
    contract: { id: '165934057', name: '53 от 2013-12-10' },
    depart: { id: '323658854', name: 'Магазин-склад' },
    documentdate: new Date().toISOString(),
    quantity: 5.6,
    price: 6.12,
  },
] as any;

export const appSystem: IAppSystem = {
  id: 'gdmn-sales-representative',
  name: 'gdmn-sales-representative',
};

export const messageAgent: IMessage<MessageType>[] = [
  {
    id: '1f26fa10-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user,
      dateTime: '2021-09-17T11:26:37.617Z',
    },
    status: 'READY',
    body: {
      type: 'REFS',
      version: 1,
      payload: {
        contact: {
          id: '1366948551',
          name: 'contact',
          visible: true,
          description: 'Контакты',
          data: [
            {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
              contractNumber: '53',
              contractDate: new Date().toISOString(),
              paycond: 'отсрочка 20 б/д_поручение',
              phoneNumber: '8-017-000-00-00, 000-00-00',
            },
            {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
              contractNumber: '573/18',
              contractDate: new Date().toISOString(),
              paycond: 'отсрочка 3 к/д_поручение',
              phoneNumber: '8-017-101-01-01',
            },
            {
              id: '1908473665',
              name: 'ООО "ПродуктМаг"',
              contractNumber: '309-СР',
              contractDate: new Date().toISOString(),
              paycond: 'отсрочка 45 к/д_ поручение',
              phoneNumber: '8-017-999-99-99, 99-99-99',
            },
          ],
        },
        good: {
          id: '1366948553',
          name: 'good',
          visible: true,
          description: 'Товары',
          metadata: {
            id: {
              sortOrder: 0,
              name: 'Идентификатор',
            },
            name: {
              sortOrder: 0,
              name: 'Наименование',
            },
            goodgroup: {
              sortOrder: 0,
              name: 'Группа ТМЦ',
            },
            alias: {
              sortOrder: 0,
              name: 'Алиас',
            },
            barcode: {
              sortOrder: 0,
              name: 'Баркод',
            },
            priceFsn: {
              sortOrder: 0,
              name: 'ФСН',
            },
            priceFso: {
              sortOrder: 0,
              name: 'ФСО',
            },
            priceFsnSklad: {
              sortOrder: 0,
              name: 'ФСН со склада',
            },
            priceFsoSklad: {
              sortOrder: 0,
              name: 'ФСО со склада',
            },
            valueName: {
              sortOrder: 0,
              name: 'Ед изм',
            },
            invWeight: {
              sortOrder: 0,
              name: 'Вес единицы',
            },
            vat: {
              sortOrder: 0,
              name: 'НДС',
            },
            scale: {
              sortOrder: 0,
              name: 'Кол-во в упаковке',
            },
          },
          data: [
            {
              id: '955211845',
              name: 'Колб. изд. "Колбаса Мортаделла"',
              goodgroup: { id: '955211845', name: '03. Продукты, колбасы' },
              alias: '4403530',
              barcode: '4810173019169',
              priceFsn: 18.78,
              priceFso: 18.31,
              priceFsnSklad: 18.78,
              priceFsoSklad: 18.78,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '955211846',
              name: 'Колб. изд. "Колбаса Сливочная"',
              goodgroup: { id: '955211845', name: '03. Продукты, колбасы' },
              alias: '4403531',
              barcode: '4810173019179',
              priceFsn: 18.56,
              priceFso: 18.12,
              priceFsnSklad: 18.56,
              priceFsoSklad: 18.56,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '955211847',
              name: 'Колб. изд. "Колбаса Столичная"',
              goodgroup: { id: '955211845', name: '03. Продукты, колбасы' },
              alias: '4403532',
              barcode: '4810173019189',
              priceFsn: 18.32,
              priceFso: 18.02,
              priceFsnSklad: 18.32,
              priceFsoSklad: 18.32,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '1572500926',
              name: 'Ветчина вар.',
              goodgroup: { id: '690457773', name: '02. Ветчины' },
              alias: '4403505',
              barcode: '4810173018286',
              priceFsn: 4.37,
              priceFso: 4.26,
              priceFsnSklad: 4.37,
              priceFsoSklad: 4.37,
              valueName: 'Батон',
              invWeight: 0.45,
              vat: 10,
            },
            {
              id: '1572500927',
              name: 'Ветчина вар. Любительская',
              goodgroup: { id: '690457773', name: '02. Ветчины' },
              alias: '4403506',
              barcode: '4810173018186',
              priceFsn: 4.37,
              priceFso: 4.26,
              priceFsnSklad: 4.37,
              priceFsoSklad: 4.37,
              valueName: 'Батон',
              invWeight: 0.45,
              vat: 10,
            },
            {
              id: '857817085',
              name: 'Колбаса вареная докторская',
              goodgroup: { id: '690457770', name: '01. Колбасы вареные' },
              alias: '4403527',
              barcode: '4810163019107',
              priceFsn: 4.82,
              priceFso: 4.24,
              priceFsnSklad: 5.18,
              priceFsoSklad: 5.18,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '857817086',
              name: 'Колбаса вареная молочная',
              goodgroup: { id: '690457770', name: '01. Колбасы вареные' },
              alias: '4403528',
              barcode: '4810173019107',
              priceFsn: 4.72,
              priceFso: 4.14,
              priceFsnSklad: 5.08,
              priceFsoSklad: 5.08,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '147035338',
              name: 'Колбаски баварские',
              goodgroup: { id: '690457778', name: '05. Продукты, колбаски' },
              alias: '4403007',
              barcode: '4810173002368',
              priceFsn: 20.42,
              priceFso: 19.78,
              priceFsnSklad: 20.42,
              priceFsoSklad: 20.42,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '147035339',
              name: 'Колбаски балканские',
              goodgroup: { id: '690457778', name: '05. Продукты, колбаски' },
              alias: '4403008',
              barcode: '4810173002369',
              priceFsn: 20.27,
              priceFso: 19.78,
              priceFsnSklad: 20.27,
              priceFsoSklad: 20.27,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '807686297',
              name: 'Сосиски молочные',
              goodgroup: { id: '690457771', name: '04. Сосиски' },
              alias: '2403149',
              barcode: '4810173012249',
              priceFsn: 5.45,
              priceFso: 5.45,
              priceFsnSklad: 5.45,
              priceFsoSklad: 5.45,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '807686298',
              name: 'Сосиски докторские',
              goodgroup: { id: '690457771', name: '04. Сосиски' },
              alias: '2403139',
              barcode: '4810173012259',
              priceFsn: 5.35,
              priceFso: 5.35,
              priceFsnSklad: 5.35,
              priceFsoSklad: 5.35,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
            {
              id: '807686299',
              name: 'Сосиски сливочные',
              goodgroup: { id: '690457771', name: '04. Сосиски' },
              alias: '2403129',
              barcode: '4810173012269',
              priceFsn: 5.85,
              priceFso: 5.85,
              priceFsnSklad: 5.85,
              priceFsoSklad: 5.85,
              valueName: 'кг',
              invWeight: 1,
              vat: 10,
            },
          ],
        },
        department: {
          id: '1366948555',
          name: 'department',
          visible: true,
          description: 'Оптовые склады',
          data: [
            { id: '356606359', name: 'адм. Строительный участок агрокомплекса' },
            { id: '357852112', name: 'адм. Сельскохозяйственное отделение' },
            { id: '357852115', name: 'Участок технического обслуживания' },
            { id: '357852117', name: 'Магазин-склад' },
            { id: '357852119', name: 'адм. Склад запасных частей' },
            { id: '182879040', name: 'адм. цех №1' },
            { id: '167337867', name: 'Участок по монтажу технологического оборудования' },
          ],
        },
        packageType: {
          id: '1366948557',
          name: 'packageType',
          visible: true,
          description: 'Типы упаковки',
          data: [
            { id: '273098056', name: '3' },
            { id: '273098057', name: '5' },
            { id: '273098058', name: '10' },
            { id: '514132623', name: 'Мал. батон' },
            { id: '514132624', name: 'Больш. батон' },
            { id: '615762858', name: 'Большой батон 5' },
            { id: '615762859', name: 'Большой батон 10' },
            { id: '1607786772', name: '500 гр.-700  гр.(10)' },
            { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
            { id: '1617776619', name: 'Мал. батон 5' },
            { id: '1607786790', name: '500 гр.-700  гр.(5)' },
            { id: '1617776621', name: 'Мал. батон 10' },
            { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
            { id: '1760463491', name: '1 кг' },
            { id: '1811739170', name: '2 кг' },
            { id: '1811739176', name: '5 кг' },
          ],
        },
        goodGroup: {
          id: '1366948559',
          name: 'goodGroup',
          visible: true,
          description: 'Группы ТМЦ',
          data: [
            {
              id: '147034075',
              parent: '',
              name: '01. Цех по производству готовой продукции',
            },
            {
              id: '690457770',
              parent: {
                id: '147034075',
                name: '01. Цех по производству готовой продукции',
              },
              name: '01. Колбасы вареные',
            },
            {
              id: '690457773',
              parent: {
                id: '147034075',
                name: '01. Цех по производству готовой продукции',
              },
              name: '02. Ветчины',
            },
            {
              id: '955211845',
              parent: {
                id: '147034075',
                name: '01. Цех по производству готовой продукции',
              },
              name: '03. Продукты, колбасы',
            },
            {
              id: '147014069',
              parent: '',
              name: '02. Готовая продукция',
            },
            {
              id: '690457771',
              parent: {
                id: '147014069',
                name: '02. Готовая продукция',
              },
              name: '04. Сосиски',
            },
            {
              id: '690457778',
              parent: {
                id: '147014069',
                name: '02. Готовая продукция',
              },
              name: '05. Продукты, колбаски',
            },
          ],
        },
        outlet: {
          id: '1366948561',
          name: 'outlet',
          visible: true,
          description: 'Магазины',
          data: [
            {
              id: '3121846445',
              name: 'Магазин "МаркетКомпани" № 1',
              company: { id: '147042924', name: 'ОАО "МаркетКомпани"' },
              phoneNumber: '',
              address: 'г. Минск ул. Лесная, 27',
              lon: 27.53348781,
              lat: 53.87221663,
            },
            {
              id: '1121464445',
              name: 'Магазин "МаркетКомпани" № 2',
              company: { id: '147042924', name: 'ОАО "МаркетКомпани"' },
              phoneNumber: '',
              address: 'г. Минск ул. Садовая, 15',
              lon: 27.6189887,
              lat: 53.92445003,
            },
            {
              id: '1367139123',
              name: 'Магазин "МаркетКомпани" № 3',
              company: { id: '147042924', name: 'ОАО "МаркетКомпани"' },
              phoneNumber: '',
              address: 'г. Минск ул. Центральная, 102',
              lon: 27.49557362,
              lat: 53.86911555,
            },
            {
              id: '819293369',
              name: 'Магазин "ЕдаЭксперт" № 1',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Набережная, 42',
              lon: 27.45957146,
              lat: 53.89014778,
            },
            {
              id: '498076351',
              name: 'Магазин "ЕдаЭксперт" № 2',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Луговая, 41 Б',
              lon: 27.62643789,
              lat: 53.93614876,
            },
            {
              id: '1854869537',
              name: 'Магазин "ЕдаЭксперт" № 3',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Полевая, 20/2',
              lon: 27.46942,
              lat: 53.91352574,
            },
            {
              id: '1673741713',
              name: 'Магазин "ЕдаЭксперт" № 4',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Солнечная, 7 Б',
              lon: 27.64203153,
              lat: 53.94083047,
            },
            {
              id: '1822992103',
              name: 'Магазин "ЕдаЭксперт" № 5',
              company: { id: '1788296478', name: 'ООО "ЕдаЭксперт"' },
              phoneNumber: '',
              address: 'г. Минск ул. Речная, 74',
              lon: 27.52604237,
              lat: 53.92429278,
            },
            {
              id: '1475086884',
              name: 'ООО "ПродуктМаг" Магазин " 1"',
              company: { id: '1908473665', name: 'ООО "ПродуктМаг"' },
              phoneNumber: '',
              address: 'г. Минск ул. Озерная, 18',
              lon: 27.65653043,
              lat: 53.92721826,
            },
          ],
        },
        packageGood: {
          id: '1366948563',
          name: 'packageGood',
          visible: true,
          description: 'Соответствие  товаров и упаковок',
          data: [
            {
              id: '184963314',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
            },
            {
              id: '184963315',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
            },
            {
              id: '184963317',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786790', name: '500 гр.-700  гр.(5)' },
            },
            {
              id: '184963314',
              good: { id: '807686297', name: 'Сосиски молочные' },
              package: { id: '1607786773', name: '2 кг. - 3 кг.(5)' },
            },
            {
              id: '184913315',
              good: { id: '807686298', name: 'Сосиски докторские' },
              package: { id: '1607786791', name: '2 кг. - 3 кг.(10)' },
            },
            {
              id: '184913316',
              good: { id: '807686298', name: 'Сосиски докторские' },
              package: { id: '1607786790', name: '500 гр.-700  гр.(5)' },
            },
            {
              id: '184913317',
              good: {
                id: '807686298',
                name: 'Сосиски докторские',
              },
              package: {
                id: '1607786790',
                name: '500 гр.-700  гр.(5)',
              },
            },
            {
              id: '184913318',
              good: {
                id: '807686298',
                name: 'Сосиски докторские',
              },
              package: {
                id: '1607786772',
                name: '500 гр.-700  гр.(10)',
              },
            },
            {
              id: '185963314',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786773',
                name: '2 кг. - 3 кг.(5)',
              },
            },
            {
              id: '185963315',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786791',
                name: '2 кг. - 3 кг.(10)',
              },
            },
            {
              id: '185963317',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786790',
                name: '500 гр.-700  гр.(5)',
              },
            },
            {
              id: '185963314',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              package: {
                id: '1607786772',
                name: '500 гр.-700  гр.(10)',
              },
            },
            {
              id: '1901774292',
              good: {
                id: '147035338',
                name: 'Колбаски баварские',
              },
              package: {
                id: '1760463491',
                name: '1 кг',
              },
            },
            {
              id: '1901774295',
              good: {
                id: '147035338',
                name: 'Колбаски баварские',
              },
              package: {
                id: '1811739170',
                name: '2 кг',
              },
            },
            {
              id: '1901774293',
              good: {
                id: '147035339',
                name: 'Колбаски балканские',
              },
              package: {
                id: '1760463491',
                name: '1 кг',
              },
            },
            {
              id: '1901774294',
              good: {
                id: '147035339',
                name: 'Колбаски балканские',
              },
              package: {
                id: '1811739170',
                name: '2 кг',
              },
            },
            {
              id: '205515518',
              good: {
                id: '955211845',
                name: 'Колб. изд. "Колбаса Мортаделла"',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '205515519',
              good: {
                id: '955211845',
                name: 'Колб. изд. "Колбаса Мортаделла"',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515511',
              good: {
                id: '955211846',
                name: 'Колб. изд. "Колбаса Сливочная"',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '205515512',
              good: {
                id: '955211846',
                name: 'Колб. изд. "Колбаса Сливочная"',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515514',
              good: {
                id: '955211847',
                name: 'Колб. изд. "Колбаса Столичная"',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '205515515',
              good: {
                id: '955211847',
                name: 'Колб. изд. "Колбаса Столичная"',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '1918111192',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '1918111195',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '1918111196',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '615762858',
                name: 'Большой батон 5',
              },
            },
            {
              id: '1918111197',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
              },
              package: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
            {
              id: '1918111191',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '1918111193',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '1918111194',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '615762858',
                name: 'Большой батон 5',
              },
            },
            {
              id: '1918111198',
              good: {
                id: '1572500927',
                name: 'Ветчина вар. Любительская',
              },
              package: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
            {
              id: '502428160',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '502428161',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '205515524',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515525',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
            {
              id: '502428160',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
            {
              id: '502428161',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: '205515524',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '273098058',
                name: '10',
              },
            },
            {
              id: '205515525',
              good: {
                id: '857817086',
                name: 'Колбаса вареная молочная',
              },
              package: {
                id: '273098057',
                name: '5',
              },
            },
          ],
        },
        documentType: {
          id: '1366948565',
          name: 'documentType',
          visible: true,
          description: 'Типы документов',
          data: [
            {
              name: 'order',
              id: '147033366',
              description: '05. Заявка1 (организация)',
            },
            {
              name: 'return',
              id: '147854428',
              description: '02. Накладная на возврат готовой продукции',
            },
            {
              name: 'route',
              id: '1366949042',
              description: '01. Список маршрутов для агентов',
            },
          ],
        },
        debt: {
          id: '1366948567',
          name: 'debt',
          visible: true,
          description: 'Дебиторские задолженности',
          data: [
            {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
              ondate: new Date().toISOString(),
              saldo: 2345600,
              saldoDebt: 1745,
            },
            {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
              ondate: new Date().toISOString(),
              saldo: -16750,
              saldoDebt: 0,
            },
            {
              id: '1788296478',
              name: 'ООО "ПродуктМаг"',
              ondate: new Date().toISOString(),
              saldo: 689571,
              saldoDebt: 12456,
            },
          ],
        },
        goodMatrix: {
          id: '147040781',
          name: 'goodMatrix',
          visible: false,
          description: 'Матрицы',
          metadata: {
            contactId: {
              sortOrder: 0,
              name: 'Организация',
              visible: false,
            },
            goodId: {
              sortOrder: 1,
              name: 'Идентификатор',
            },
            priceFsn: {
              sortOrder: 2,
              name: 'Цена ФСН',
            },
            priceFso: {
              sortOrder: 3,
              name: 'Цена ФСО',
            },
            priceFsnSklad: {
              sortOrder: 4,
              name: 'Цена ФСН склад',
            },
            priceFsoSklad: {
              sortOrder: 5,
              name: 'Цена ФСО склад',
            },
          },
          data: [
            {
              '147042924': [
                {
                  goodId: '955211845',
                  priceFsn: 18.78,
                  priceFso: 18.31,
                  priceFsnSklad: 18.78,
                  priceFsoSklad: 18.78,
                },
                {
                  goodId: '955211846',
                  priceFsn: 18.56,
                  priceFso: 18.12,
                  priceFsnSklad: 18.56,
                  priceFsoSklad: 18.56,
                },
              ],
              '1788296478': [
                {
                  goodId: '955211846',
                  priceFsn: 18.56,
                  priceFso: 18.12,
                  priceFsnSklad: 18.56,
                  priceFsoSklad: 18.56,
                },
                {
                  goodId: '807686297',
                  priceFsn: 5.45,
                  priceFso: 5.45,
                  priceFsnSklad: 5.45,
                  priceFsoSklad: 5.45,
                },
                {
                  goodId: '147035338',
                  priceFsn: 20.42,
                  priceFso: 18.02,
                  priceFsnSklad: 20.42,
                  priceFsoSklad: 20.42,
                },
                {
                  goodId: '807686299',
                  priceFsn: 5.85,
                  priceFso: 5.85,
                  priceFsnSklad: 5.85,
                  priceFsoSklad: 5.85,
                },
                {
                  goodId: '955211847',
                  priceFsn: 18.32,
                  priceFso: 18.02,
                  priceFsnSklad: 18.32,
                  priceFsoSklad: 18.32,
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: '1f511750-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user,
      dateTime: '2021-09-17T11:26:37.893Z',
    },
    status: 'READY',
    body: {
      type: 'DOCS',
      version: 1,
      payload: [
        {
          id: '1367139385',
          number: '1',
          documentDate: new Date().toISOString(),
          documentType: {
            id: '1366949042',
            name: 'route',
            description: '01. Список маршрутов для агентов',
          },
          status: 'DRAFT',
          head: {
            agent: {
              id: '875701130',
              name: 'Короткевич З.С.',
            },
          },
          lines: [
            {
              id: '1367136451',
              ordNumber: 1,
              visited: false,
              outlet: {
                id: '3121846445',
                name: 'Магазин "МаркетКомпани" № 1',
                address: 'г. Минск ул. Лесная , 27',
              },
            },
            {
              id: '1367136452',
              ordNumber: 2,
              visited: false,
              outlet: {
                id: '1367139123',
                name: 'Магазин "МаркетКомпани" № 3',
                address: 'г. Минск ул. Центральная, 102',
              },
            },
            {
              id: '1367136453',
              ordNumber: 3,
              visited: false,
              outlet: {
                id: '819293369',
                name: 'Магазин "ЕдаЭксперт" № 1',
                address: 'г. Минск ул. Набережная, 42',
              },
            },
            {
              id: '1367136454',
              ordNumber: 4,
              visited: false,
              outlet: {
                id: '1854869537',
                name: 'Магазин "ЕдаЭксперт" № 3',
                address: 'г. Минск ул. Полевая, 20/2',
              },
            },
            {
              id: '1367136455',
              ordNumber: 5,
              visited: false,
              outlet: {
                id: '1822992103',
                name: 'Магазин "ЕдаЭксперт" № 5',
                address: 'г. Минск ул. Речная, 74',
              },
            },
          ],
        },
        {
          id: '1367136392',
          number: '2',
          documentDate: new Date().toISOString(),
          documentType: {
            id: '1366949042',
            name: 'route',
            description: '01. Список маршрутов для агентов',
          },
          status: 'DRAFT',
          head: {
            agent: {
              id: '875701130',
              name: 'Короткевич З.С.',
            },
          },
          lines: [
            {
              id: '1367136451',
              ordNumber: 6,
              visited: false,
              outlet: {
                id: '1121464445',
                name: 'Магазин "МаркетКомпани" № 2',
                address: 'г. Минск ул. Садовая , 15',
              },
            },
            {
              id: '1673741713',
              ordNumber: 7,
              visited: false,
              outlet: {
                id: '498076351',
                name: 'Магазин "ЕдаЭксперт" № 2',
                address: 'г. Минск ул. Луговая, 41 Б',
              },
            },
            {
              id: '1367136453',
              ordNumber: 8,
              visited: false,
              outlet: {
                id: '1673741713',
                name: 'Магазин "ЕдаЭксперт" № 4',
                address: 'г. Минск ул. Солнечная, 7 Б',
              },
            },
            {
              id: '1367136454',
              ordNumber: 9,
              visited: false,
              outlet: {
                id: '1475086884',
                name: 'ООО "ПродуктМаг" Магазин " 1"',
                address: 'г. Минск ул. Озерная, 18',
              },
            },
          ],
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d2',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            onDate: new Date().toISOString(),
            outlet: {
              id: '819293369',
              name: 'Магазин "ЕдаЭксперт" № 1',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e89',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
                priceFsn: 4.82,
              },
              quantity: 2,
              packagekey: {
                id: '1617776619',
                name: 'Мал. батон 5',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e88',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
                priceFsn: 4.82,
              },
              quantity: 2,
              packagekey: {
                id: '1617776621',
                name: 'Мал. батон 10',
              },
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d3',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            onDate: new Date().toISOString(),
            outlet: {
              id: '498076351',
              name: 'Магазин "ЕдаЭксперт" № 2',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e87',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
                priceFsn: 4.37,
              },
              quantity: 2,
              packagekey: {
                id: '615762858',
                name: 'Большой батон 5',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e86',
              good: {
                id: '1572500926',
                name: 'Ветчина вар.',
                priceFsn: 4.37,
              },
              quantity: 2,
              packagekey: {
                id: '615762859',
                name: 'Большой батон 10',
              },
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '21b5e719-f3dc-411e-ab83-16735d95f1d5',
          documentType: {
            name: 'order',
            id: '147033366',
            description: '05. Заявка1 (организация)',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
            },
            onDate: new Date().toISOString(),
            outlet: {
              id: '1121464445',
              name: 'Магазин "МаркетКомпани" № 2',
            },
            depart: {
              id: '357852117',
              name: 'Магазин-склад',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e85',
              good: {
                id: '147035338',
                name: 'Колбаски баварские',
                priceFsn: 20.42,
              },
              quantity: 2,
              packagekey: {
                id: '1811739170',
                name: '2 кг',
              },
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e84',
              good: {
                id: '147035339',
                name: 'Колбаски балканские',
                priceFsn: 20.27,
              },
              quantity: 2,
              packagekey: {
                id: '1811739170',
                name: '2 кг',
              },
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '67fbdb01-e089-4d80-b318-7ec9ae0f27da',
          documentType: {
            name: 'return',
            id: '147854428',
            description: '02. Накладная на возврат готовой продукции',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '1788296478',
              name: 'ООО "ЕдаЭксперт"',
            },
            outlet: {
              id: '1854869537',
              name: 'Магазин "ЕдаЭксперт" № 3',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e83',
              good: {
                id: '807686298',
                name: 'Сосиски докторские',
              },
              quantity: 2,
              packagekey: {
                id: '1607786772',
                name: '500 гр.-700  гр.(10)',
              },
              priceFromSellBill: 3.68,
              quantityFromSellBill: 4.2,
              sellBillId: '1246759231',
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e82',
              good: {
                id: '807686299',
                name: 'Сосиски сливочные',
              },
              quantity: 5,
              packagekey: {
                id: '1607786773',
                name: '2 кг. - 3 кг.(5)',
              },
              priceFromSellBill: 5.35,
              quantityFromSellBill: 4.9511,
              sellBillId: '1246759230',
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '67fbdb01-e089-4d80-b318-7ec9ae0f27dd',
          documentType: {
            name: 'return',
            id: '147854428',
            description: '02. Накладная на возврат готовой продукции',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '147042924',
              name: 'ОАО "МаркетКомпани"',
            },
            outlet: {
              id: '1367139123',
              name: 'Магазин "МаркетКомпани" № 3',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e81',
              good: {
                id: '807686297',
                name: 'Сосиски молочные',
              },
              quantity: 2,
              packagekey: {
                id: '1607786791',
                name: '2 кг. - 3 кг.(10)',
              },
              priceFromSellBill: 4.96,
              quantityFromSellBill: 4.0,
              sellBillId: '1246753230',
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e80',
              good: {
                id: '807686297',
                name: 'Сосиски молочные',
              },
              quantity: 2,
              packagekey: {
                id: '1607786790',
                name: '500 гр.-700  гр.(5)',
              },
              priceFromSellBill: 6.35,
              quantityFromSellBill: 5.381,
              sellBillId: '1246752587',
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
        {
          id: '67fbdb01-e089-4d80-b318-7ec9ae0f27db',
          documentType: {
            name: 'return',
            id: '147854428',
            description: '02. Накладная на возврат готовой продукции',
          },
          number: '1',
          documentDate: new Date().toISOString(),
          status: 'DRAFT',
          head: {
            contact: {
              id: '1908473665',
              name: 'ООО "ПродуктМаг"',
            },
            outlet: {
              id: '1475086884',
              name: 'ООО "ПродуктМаг" Магазин № 1',
            },
          },
          lines: [
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e79',
              good: {
                id: '857817085',
                name: 'Колбаса вареная докторская',
              },
              quantity: 2,
              packagekey: {
                id: '1617776619',
                name: 'мал. батон 5',
              },
              priceFromSellBill: 5.34,
              quantityFromSellBill: 8.69,
              sellBillId: '1246759250',
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e78',
              good: {
                id: '955211845',
                name: 'Колб. изд. "Колбаса Мортаделла"',
              },
              quantity: 2,
              packagekey: {
                id: '273098058',
                name: '10',
              },
              priceFromSellBill: 4.68,
              quantityFromSellBill: 4,
              sellBillId: '1656799230',
            },
            {
              id: 'ab0d8341-1d64-4dc8-bd42-f030af280e77',
              good: {
                id: '955211847',
                name: 'Колб. изд. "Колбаса Столичная"',
              },
              quantity: 2,
              packagekey: {
                id: '273098057',
                name: '5',
              },
              priceFromSellBill: 6.35,
              quantityFromSellBill: 5.98,
              sellBillId: '1246799230',
            },
          ],
          creationDate: new Date().toISOString(),
          editionDate: new Date().toISOString(),
        },
      ] as any[],
    },
  },
  {
    id: '1f5cd720-17aa-11ec-951e-7fdefda6eb8e',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user,
      dateTime: '2021-09-17T11:26:37.970Z',
    },
    status: 'READY',
    body: {
      type: 'SETTINGS',
      version: 1,
      payload: [
        {
          depart: { id: '357852117', name: 'Магазин-склад' },
        },
      ] as any[],
    },
  },
];
