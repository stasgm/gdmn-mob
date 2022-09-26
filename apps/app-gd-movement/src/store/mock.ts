import { companies, user2, device } from '@lib/mock';
import { IAppSystem, IMessage, INamedEntity, MessageType } from '@lib/types';

export const appSystem: IAppSystem = {
  id: 'gdmn-gd-movement',
  name: 'gdmn-gd-movement',
};

export const messageGdMovement: IMessage<MessageType>[] = [
  {
    id: '147293377',
    status: 'READY',
    head: {
      appSystem,
      company: companies[2] as INamedEntity,
      consumer: user2,
      producer: user2,
      dateTime: new Date().toISOString(),
      order: 1,
      deviceId: device.id,
    },
    body: {
      type: 'REFS',
      version: 1,
      payload: {
        documentType: {
          id: '187037521',
          name: 'documentType',
          visible: true,
          description: 'Типы документов',
          data: [
            {
              id: '147037014',
              name: 'prihod',
              description: 'Приход',
              isRemains: false,
              remainsField: 'toContact',
              fromDescription: 'Откуда',
              fromType: 'contact',
              fromRequired: true,
              toDescription: 'Куда',
              toType: 'department',
              toRequired: true,
              sortOrder: 1,
              subtype: 'inventory',
            },
            {
              id: '187034606',
              name: 'inventory',
              description: 'Инвентаризация',
              isRemains: true,
              remainsField: 'toContact',
              fromDescription: '',
              fromType: '',
              fromRequired: false,
              toDescription: 'Место',
              toType: 'department',
              toRequired: true,
              sortOrder: 2,
              subtype: 'inventory',
            },
            {
              id: '189548606',
              name: 'scan',
              description: 'Сканирование',
              sortOrder: 3,
              subtype: 'scan',
            },
          ],
        },
        good: {
          id: '187037523',
          name: 'good',
          visible: true,
          description: 'Справочник ТМЦ',
          metadata: {
            id: {
              sortOrder: 0,
              name: 'Идентификатор',
            },
            name: {
              sortOrder: 0,
              name: 'Наименование',
            },
            alias: {
              sortOrder: 0,
              name: 'Алиас',
            },
            barcode: {
              sortOrder: 0,
              name: 'Штрих-код',
            },
            valueName: {
              sortOrder: 0,
              name: 'Ед изм',
            },
            inFrac: {
              sortOrder: 0,
              name: 'Вес единицы',
            },
            weightCode: {
              sortOrder: 0,
              name: 'Весовой товар',
            },
          },
          data: [
            {
              id: 'unknown',
              name: 'Неизвестный товар',
              alias: '',
              barcode: 'unknown',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '153359486',
              name: 'Книга',
              alias: '86427',
              barcode: '9789854480947',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '111159486',
              name: 'Тетрадь',
              alias: '36985',
              barcode: '3329687853219',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '111852486',
              name: 'Ручка шариковая',
              alias: '76138',
              barcode: '3329687853210',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
            },
            {
              id: '147067755',
              alias: '95135',
              barcode: '2000100029466',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Степлер',
            },
            {
              id: '147067788',
              alias: '87613',
              barcode: '2000100029906',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Дырокол',
            },
            {
              id: '147067789',
              alias: '12585',
              barcode: '2000100029467',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Бейдж',
            },
            {
              id: '147067790',
              alias: '78512',
              barcode: '2000100029468',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Штамп',
            },
            {
              id: '147067791',
              alias: '12602',
              barcode: '2000100029469',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Блокнот А5',
            },
            {
              id: '147067792',
              alias: '48956',
              barcode: '2000100029470',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Календарь',
            },
            {
              id: '147067793',
              alias: '84962',
              barcode: '2000100029471',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Подставка настольная',
            },
            {
              id: '147067794',
              alias: '14652',
              barcode: '2000100029472',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Корректирующая ручка',
            },
            {
              id: '147067795',
              alias: '52622',
              barcode: '2000100029473',
              valueName: 'шт',
              isFrac: 1,
              weightCode: '',
              name: 'Текстовыделитель',
            },
            {
              id: '153359485',
              alias: '24617',
              barcode: '3549109954786',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Изделие колбасное',
            },
            {
              id: '153367898',
              alias: '29167',
              barcode: '9913000005221',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Рулет Европейский',
            },
            {
              id: '157381934',
              alias: '49161',
              barcode: '9913000005047',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Смесь сухая',
            },
            {
              id: '172067346',
              alias: '72140',
              barcode: '4811219038625',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса Докторская',
            },
            {
              id: '185970902',
              alias: '25156',
              barcode: '3540029954786',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Дрожжи',
            },
            {
              id: '147066836',
              alias: '32658',
              barcode: '2175762871935',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса Сливочная',
            },
            {
              id: '147066837',
              alias: '46150',
              barcode: '2281628751689',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаски Баварские',
            },
            {
              id: '147066838',
              alias: '25623',
              barcode: '4270623158462',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Колбаса для гриля',
            },
            {
              id: '147066839',
              alias: '69510',
              barcode: '2271193258841',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Арахис фасованный',
            },
            {
              id: '147066840',
              alias: '36258',
              barcode: '2306763298512',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Масло подсолнечное',
            },
            {
              id: '147067756',
              alias: '26526',
              barcode: '2000100029466',
              valueName: 'кг',
              isFrac: 1,
              weightCode: '',
              name: 'Сахар',
            },
          ],
        },
        department: {
          id: '187037527',
          name: 'department',
          visible: true,
          description: 'Подразделение',
          data: [
            {
              id: '176424776',
              name: 'Подразделение №1',
            },
            {
              id: '147030694',
              name: 'Подразделение №2',
            },
            {
              id: '147016473',
              name: 'Подразделение №3',
            },
            {
              id: '147030695',
              name: 'Подразделение №4',
            },
            {
              id: '147030696',
              name: 'Подразделение №5',
            },
          ],
        },
        contact: {
          id: '147023423',
          name: 'contact',
          visible: true,
          description: 'Контакты',
          data: [
            {
              id: '147016471',
              name: 'ОАО "МаркетКомпани"',
              phoneNumber: '8-017-000-00-00, 000-00-00',
            },
            {
              id: '147016507',
              name: 'ООО "ЕдаЭксперт"',
              phoneNumber: '8-017-101-01-01',
            },
            {
              id: '147016513',
              name: 'ООО "ПродуктМаг"',
              phoneNumber: '8-017-101-01-01',
            },
          ],
        },
        remains: {
          id: '187037529',
          name: 'remains',
          visible: false,
          description: 'Остатки ТМЦ',
          data: [
            {
              '176424776': [
                {
                  goodId: '111159486',
                  price: 13.13,
                  buyingPrice: 13,
                  q: 13,
                },
                {
                  goodId: '147067795',
                  price: 1.77,
                  buyingPrice: 1.28,
                  q: 11,
                },
                {
                  goodId: '111852486',
                  price: 13.5,
                  buyingPrice: 12.28,
                  q: 2,
                },
              ],
              '147030694': [
                {
                  goodId: '147067755',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 3,
                },
                {
                  goodId: '147067788',
                  price: 11.11,
                  buyingPrice: 12.28,
                  q: 11,
                },
                {
                  goodId: '111159486',
                  price: 13.13,
                  buyingPrice: 13,
                  q: 13,
                },
                {
                  goodId: '147067790',
                  price: 9.82,
                  buyingPrice: 9.28,
                  q: 2,
                },
                {
                  goodId: '147067791',
                  price: 1.77,
                  buyingPrice: 1.28,
                  q: 11,
                },
                {
                  goodId: '147067792',
                  price: 13.5,
                  buyingPrice: 12.28,
                  q: 2,
                },
              ],
              '147016473': [
                {
                  goodId: '153367898',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '153359485',
                  price: 19.01,
                  buyingPrice: 19.28,
                  q: 4.5,
                },
                {
                  goodId: '172067346',
                  price: 11.31,
                  buyingPrice: 12.58,
                  q: 5.75,
                },
                {
                  goodId: '147066838',
                  price: 14.65,
                  buyingPrice: 14.83,
                  q: 7.8,
                },
              ],
              '147030695': [
                {
                  goodId: '147066840',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '157381934',
                  price: 18.75,
                  buyingPrice: 18.28,
                  q: 7.8,
                },
                {
                  goodId: '172067346',
                  price: 9.9,
                  buyingPrice: 9.28,
                  q: 9.2,
                },
                {
                  goodId: '147067756',
                  price: 10.57,
                  buyingPrice: 10.28,
                  q: 7.652,
                },
              ],
              '147030696': [
                {
                  goodId: '153367898',
                  price: 19.01,
                  buyingPrice: 19.28,
                  q: 2.567,
                },
                {
                  goodId: '147066836',
                  price: 16.01,
                  buyingPrice: 16.28,
                  q: 5.4,
                },
                {
                  goodId: '147066838',
                  price: 17.01,
                  buyingPrice: 18.28,
                  q: 8.74,
                },
                {
                  goodId: '157381934',
                  price: 18.01,
                  buyingPrice: 19.28,
                  q: 9.2,
                },
              ],
              '147016471': [
                {
                  goodId: '147067793',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2,
                },
                {
                  goodId: '147067794',
                  price: 14,
                  buyingPrice: 13.65,
                  q: 3,
                },
                {
                  goodId: '147067795',
                  price: 2.01,
                  buyingPrice: 2.28,
                  q: 4,
                },
              ],
              '147016507': [
                {
                  goodId: '147066836',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 6,
                },
                {
                  goodId: '147066837',
                  price: 13.5,
                  buyingPrice: 14.28,
                  q: 5.5,
                },
                {
                  goodId: '147066838',
                  price: 17.45,
                  buyingPrice: 17.8,
                  q: 3.7,
                },
                {
                  goodId: '172067346',
                  price: 9.01,
                  buyingPrice: 9.28,
                  q: 4.5,
                },
                {
                  goodId: '153359485',
                  price: 12.21,
                  buyingPrice: 12.28,
                  q: 12.56,
                },
              ],
              '147016513': [
                {
                  goodId: '147066839',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '185970902',
                  price: 11.6,
                  buyingPrice: 12.68,
                  q: 13.5,
                },
                {
                  goodId: '157381934',
                  price: 15.43,
                  buyingPrice: 15.68,
                  q: 5,
                },
              ],
              '147093200': [
                {
                  goodId: '147067795',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 3,
                },
                {
                  goodId: '147067792',
                  price: 11.01,
                  buyingPrice: 12.28,
                  q: 13,
                },
                {
                  goodId: '147067789',
                  price: 12.85,
                  buyingPrice: 12.65,
                  q: 5,
                },
                {
                  goodId: '111159486',
                  price: 6.95,
                  buyingPrice: 6.5,
                  q: 3,
                },
              ],
              '147093201': [
                {
                  goodId: '172067346',
                  price: 11.01,
                  buyingPrice: 12.1,
                  q: 2.567,
                },
                {
                  goodId: '147067756',
                  price: 21.01,
                  buyingPrice: 22.26,
                  q: 7.5,
                },
                {
                  goodId: '185970902',
                  price: 15.06,
                  buyingPrice: 15.25,
                  q: 5,
                },
                {
                  goodId: '153367898',
                  price: 5.03,
                  buyingPrice: 5.28,
                  q: 6.54,
                },
                {
                  goodId: '147066840',
                  price: 10.52,
                  buyingPrice: 10.08,
                  q: 4.33,
                },
              ],
              '147257062': [
                {
                  goodId: '111852486',
                  price: 11.01,
                  buyingPrice: 12.28,
                  q: 2,
                },
                {
                  goodId: '153359486',
                  price: 25.01,
                  buyingPrice: 24.28,
                  q: 3,
                },
                {
                  goodId: '147067755',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 5,
                },
                {
                  goodId: '147067788',
                  price: 35.48,
                  buyingPrice: 35.48,
                  q: 4,
                },
                {
                  goodId: '147067793',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 3,
                },
              ],
              '147527919': [
                {
                  goodId: '147066838',
                  price: 21.01,
                  buyingPrice: 22.28,
                  q: 2.567,
                },
                {
                  goodId: '157381934',
                  price: 16.01,
                  buyingPrice: 16.28,
                  q: 8,
                },
                {
                  goodId: '147066840',
                  price: 14.74,
                  buyingPrice: 13.56,
                  q: 7.82,
                },
                {
                  goodId: '185970902',
                  price: 25.01,
                  buyingPrice: 24.28,
                  q: 10.56,
                },
              ],
            },
          ],
        },
        employee: {
          id: '181073791',
          name: 'employee',
          visible: true,
          description: 'Сотрудники',
          metadata: {
            id: { sortOrder: 0, visible: false },
            name: { sortOrder: 1, name: 'ФИО' },
            lastName: { sortOrder: 2, name: 'Фамилия' },
            firstName: { sortOrder: 3, name: 'Имя' },
            middleName: { sortOrder: 4, name: 'Отчество' },
            position: { sortOrder: 5, name: 'Должность' },
          },
          data: [
            {
              id: '147093200',
              name: 'Иванова Дарья Викторовна',
              firstName: 'Дарья',
              middleName: 'Викторовна',
              lastName: 'Иванова',
              position: { id: '147527836', name: 'Главный бухгалтер' },
            },
            {
              id: '147093201',
              name: 'Антонов Алексей Витальевич',
              firstName: 'Алексей',
              middleName: 'Витальевич',
              lastName: 'Антонов',
              position: {
                id: '151231946',
                name: 'Ведущий инженер',
              },
            },
            {
              id: '147257062',
              name: 'Зайцев Николай Романович',
              firstName: 'Николай',
              middleName: 'Романович',
              lastName: 'Зайцев',
              position: { id: '148477406', name: 'Главный инженер' },
            },
            {
              id: '147527919',
              name: 'Маркова Вероника Николаевна',
              firstName: 'Вероника',
              middleName: 'Николаевна',
              lastName: 'Маркова',
              position: { id: '147527678', name: 'Заведующий складом' },
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
      producer: user2,
      dateTime: new Date().toISOString(),
      order: 2,
      deviceId: device.id,
    },
    status: 'READY',
    body: {
      type: 'DOCS',
      version: 1,
      payload: [
        {
          creationDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          documentType: {
            description: 'Приход',
            fromDescription: 'Откуда',
            fromRequired: true,
            fromType: 'contact',
            id: '147037014',
            isRemains: false,
            name: 'prihod',
            remainsField: 'toContact',
            sortOrder: 1,
            toDescription: 'Куда',
            toRequired: true,
            toType: 'department',
          },
          editionDate: new Date().toISOString(),
          head: {
            fromContact: {
              id: '147016507',
              name: 'ООО "ЕдаЭксперт"',
              phoneNumber: '8-017-101-01-01',
            },
            fromContactType: {
              id: 'contact',
              value: 'Организация',
            },
            toContact: {
              id: '147030694',
              name: 'Подразделение №2',
            },
            toContactType: {
              id: 'department',
              value: 'Подразделение',
            },
          },
          id: '4a7cd7f951',
          lines: [
            {
              buyingPrice: 13,
              good: {
                id: '111159486',
                name: 'Тетрадь',
              },
              id: '9705e6428c',
              price: 13.13,
              quantity: 3,
              remains: 13,
            },
            {
              buyingPrice: 9.28,
              good: {
                id: '147067790',
                name: 'Штамп',
              },
              id: '77f483bbfb',
              price: 9.82,
              quantity: 9,
              remains: 2,
            },
          ],
          number: '1',
          status: 'DRAFT',
        },
        {
          creationDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          documentType: {
            description: 'Инвентаризация',
            fromDescription: '',
            fromRequired: false,
            fromType: '',
            id: '187034606',
            isRemains: true,
            name: 'inventory',
            remainsField: 'toContact',
            sortOrder: 2,
            toDescription: 'Место',
            toRequired: true,
            toType: 'department',
          },
          editionDate: new Date().toISOString(),
          head: {
            toContact: {
              id: '147016473',
              name: 'Подразделение №3',
            },
            toContactType: {
              id: 'department',
              value: 'Подразделение',
            },
          },
          id: '5cca26ea67',
          lines: [
            {
              buyingPrice: 12.58,
              good: {
                id: '172067346',
                name: 'Колбаса Докторская',
              },
              id: '43a19e38ff',
              price: 11.31,
              quantity: 6,
              remains: 5.75,
            },
            {
              buyingPrice: 14.83,
              good: {
                id: '147066838',
                name: 'Колбаса для гриля',
              },
              id: 'fe2cfaf836',
              price: 14.65,
              quantity: 9,
              remains: 7.8,
            },
          ],
          number: '2',
          status: 'DRAFT',
        },
        {
          creationDate: new Date().toISOString(),
          documentDate: new Date().toISOString(),
          documentType: {
            id: '189548606',
            name: 'scan',
            description: 'Сканирование',
          },
          editionDate: new Date().toISOString(),
          head: {
            department: {
              id: '176424776',
              name: 'Подразделение №1',
            },
          },
          id: '4a7cd7f882',
          lines: [
            {
              id: '9705e64208c',
              barcode:
                'MDEwNDgxMTY0NDAwNjg2MjIxMlM1R2hNYTJKR05VWh05MTAwMDUdOTJyM2toTW5G Sk1XUU5mdEhmU3BxTTZvSjZnZkpHUkdMQnBBb2g1VG04Q2FyZSAwMTA0ODExNjQ0 MDA2ODYyMjEyUzhWeDViTTZIOU5OHTkxMDAwNR05MnRIQzdNVVFhQmFvZUtSY0dZ UW5jQTJiQ3F6UGc5bzlGaEI2TllqdGRuRTRVIDAxMDQ4MTE2NDQwMDY4NjIyMTJz YW56ZExzQ0d0R1kdOTEwMDA1HTkyZ2lkbnJuMkNtZTRiOE5rSEs3Sjh6SzFvN0Z2 QUttOTFXVlBFNFVkelFXRjYgMDEwNDgxMTY0NDAwNjg2MjIxMnNIOGFOYUY1Q2lI SB05MTAwMDUdOTJoRmYyQXJYTVdMZlRLYzN6OExrbXJGbTgxY0E4N2ZvVGNQc2VC QW9EQkdXcyAwMTA0ODExNjQ0MDA2ODYyMjEyU0pMUVE3UnhDZ0JpHTkxMDAwNR05 Mmdnd2dFRDFzcEdOWWNMdzJraGR3UnNTendiaERYWDVWdFFVTVBEUlBINlF3IDAx MDQ4MTE2NDQwMDY4NjIyMTJzS0Z0NUJ2aktzNWIdOTEwMDA1HTkyMnFuZThydWNk bXgxZTdxbUxBMVBpVTJ1U3VjVEhvNEFMZHczREFZaTdFOVcgMDEwNDgxMTY0NDAw Njg2MjIxMnNMY1VoVlBhRHd3cB05MTAwMDUdOTJ0cWVESjY0OGF3Z2MyY2lOYW1v Y1VhWFFldG1hQ1NTenI3M3hqc2NHVU1LeiAwMTA0ODExNjQ0MDA2ODYyMjEyVFdq OTVIYWlqOEhuHTkxMDAwNR05MnBVVk1TZTZ0d2piZzM0V21aeXBudlE3U3RrZkVx TXFMWUJNa3RmSEpKRXZFIDAxMDQ4MTE2NDQwMDY4NjIyMTJ0V2pDUEU5ZGlBanUd OTEwMDA1HTkyUlhoS0M1aDZIMkZmcXZXZ0taUzd2NHR3OGZYUkNMdHhZcVB6NDFj RHJManM=',
            },
            {
              id: '77f480bbfb',
              barcode: '↔0104604278005512215L-BE7DviugKG↔91EE07↔92g2JT/fX7Imukyq/obZW9JpMe9e4aOlhNx+ywwvpFm8s=',
            },
            {
              id: '9705e6429c',
              barcode: '↔0104604278003303215i_IpdqpL<?he↔91EE07↔92NuJ6AmWSjBCxXDdTTT19JYmo4Y+lpfk+/eLxtBXh/cQ=',
            },
            {
              id: '77f484bbfb',
              barcode:
                'MDEwNDgxMTY0NDAwNjg2MjIxMlM1R2hNYTJKR05VWh05MTAwMDUdOTJyM2toTW5G Sk1XUU5mdEhmU3BxTTZvSjZnZkpHUkdMQnBBb2g1VG04Q2FyZSAwMTA0ODExNjQ0 MDA2ODYyMjEyUzhWeDViTTZIOU5OHTkxMDAwNR05MnRIQzdNVVFhQmFvZUtSY0dZ UW5jQTJiQ3F6UGc5bzlGaEI2TllqdGRuRTRVIDAxMDQ4MTE2NDQwMDY4NjIyMTJz YW56ZExzQ0d0R1kdOTEwMDA1HTkyZ2lkbnJuMkNtZTRiOE5rSEs3Sjh6SzFvN0Z2 QUttOTFXVlBFNFVkelFXRjYgMDEwNDgxMTY0NDAwNjg2MjIxMnNIOGFOYUY1Q2lI SB05MTAwMDUdOTJoRmYyQXJYTVdMZlRLYzN6OExrbXJGbTgxY0E4N2ZvVGNQc2VC QW9EQkdXcyAwMTA0ODExNjQ0MDA2ODYyMjEyU0pMUVE3UnhDZ0JpHTkxMDAwNR05 Mmdnd2dFRDFzcEdOWWNMdzJraGR3UnNTendiaERYWDVWdFFVTVBEUlBINlF3IDAx MDQ4MTE2NDQwMDY4NjIyMTJzS0Z0NUJ2aktzNWIdOTEwMDA1HTkyMnFuZThydWNk bXgxZTdxbUxBMVBpVTJ1U3VjVEhvNEFMZHczREFZaTdFOVcgMDEwNDgxMTY0NDAw Njg2MjIxMnNMY1VoVlBhRHd3cB05MTAwMDUdOTJ0cWVESjY0OGF3Z2MyY2lOYW1v Y1VhWFFldG1hQ1NTenI3M3hqc2NHVU1LeiAwMTA0ODExNjQ0MDA2ODYyMjEyVFdq OTVIYWlqOEhuHTkxMDAwNR05MnBVVk1TZTZ0d2piZzM0V21aeXBudlE3U3RrZkVx TXFMWUJNa3RmSEpKRXZFIDAxMDQ4MTE2NDQwMDY4NjIyMTJ0V2pDUEU5ZGlBanUd OTEwMDA1HTkyUlhoS0M1aDZIMkZmcXZXZ0taUzd2NHR3OGZYUkNMdHhZcVB6NDFj RHJManM=',
            },
            {
              id: '9705e6430c',
              barcode: '↔0104604278005512215L-BE7DviugKG↔91EE07↔92g2JT/fX7Imukyq/obZW9JpMe9e4aOlhNx+ywwvpFm8s=',
            },
            {
              id: '77f485bbfb',
              barcode:
                'MDEwNDgxMTY0NDAwNjg2MjIxMlM1R2hNYTJKR05VWh05MTAwMDUdOTJyM2toTW5G Sk1XUU5mdEhmU3BxTTZvSjZnZkpHUkdMQnBBb2g1VG04Q2FyZSAwMTA0ODExNjQ0 MDA2ODYyMjEyUzhWeDViTTZIOU5OHTkxMDAwNR05MnRIQzdNVVFhQmFvZUtSY0dZ UW5jQTJiQ3F6UGc5bzlGaEI2TllqdGRuRTRVIDAxMDQ4MTE2NDQwMDY4NjIyMTJz YW56ZExzQ0d0R1kdOTEwMDA1HTkyZ2lkbnJuMkNtZTRiOE5rSEs3Sjh6SzFvN0Z2 QUttOTFXVlBFNFVkelFXRjYgMDEwNDgxMTY0NDAwNjg2MjIxMnNIOGFOYUY1Q2lI SB05MTAwMDUdOTJoRmYyQXJYTVdMZlRLYzN6OExrbXJGbTgxY0E4N2ZvVGNQc2VC QW9EQkdXcyAwMTA0ODExNjQ0MDA2ODYyMjEyU0pMUVE3UnhDZ0JpHTkxMDAwNR05 Mmdnd2dFRDFzcEdOWWNMdzJraGR3UnNTendiaERYWDVWdFFVTVBEUlBINlF3IDAx MDQ4MTE2NDQwMDY4NjIyMTJzS0Z0NUJ2aktzNWIdOTEwMDA1HTkyMnFuZThydWNk bXgxZTdxbUxBMVBpVTJ1U3VjVEhvNEFMZHczREFZaTdFOVcgMDEwNDgxMTY0NDAw Njg2MjIxMnNMY1VoVlBhRHd3cB05MTAwMDUdOTJ0cWVESjY0OGF3Z2MyY2lOYW1v Y1VhWFFldG1hQ1NTenI3M3hqc2NHVU1LeiAwMTA0ODExNjQ0MDA2ODYyMjEyVFdq OTVIYWlqOEhuHTkxMDAwNR05MnBVVk1TZTZ0d2piZzM0V21aeXBudlE3U3RrZkVx TXFMWUJNa3RmSEpKRXZFIDAxMDQ4MTE2NDQwMDY4NjIyMTJ0V2pDUEU5ZGlBanUd OTEwMDA1HTkyUlhoS0M1aDZIMkZmcXZXZ0taUzd2NHR3OGZYUkNMdHhZcVB6NDFj RHJManM=',
            },
            {
              id: '77f500bbfb',
              barcode: '↔0104604278003303215i_IpdqpL<?he↔91EE07↔92NuJ6AmWSjBCxXDdTTT19JYmo4Y+lpfk+/eLxtBXh/cQ=',
            },
            {
              id: '9705e6446c',
              barcode: '↔0104604278005512215L-BE7DviugKG↔91EE07↔92g2JT/fX7Imukyq/obZW9JpMe9e4aOlhNx+ywwvpFm8s=',
            },
          ],
          number: '1',
          status: 'DRAFT',
        },
      ] as any[],
    },
  },
];
