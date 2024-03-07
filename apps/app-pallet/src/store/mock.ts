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
              id: '189912364',
              name: 'pallet',
              description: 'Паллетный лист',
              sortOrder: 4,
              subtype: 'pallet',
            },
          ],
        },
      },
    },
  },
];
