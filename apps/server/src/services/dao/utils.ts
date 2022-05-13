import { INamedEntity } from '@lib/types';

import { NamedDBEntities } from './db';

// async function getNamedEntity(ids: string, dbObject: NamedDBEntities): Promise<INamedEntity>;
// async function getNamedEntity(ids: string[], dbObject: NamedDBEntities): Promise<INamedEntity[]>;
// async function getNamedEntity(
//   ids: string | string[],
//   dbObject: NamedDBEntities,
// ): Promise<INamedEntity | INamedEntity[]> {
//   if (typeof ids === 'string') {
//     const item = await dbObject.find(ids);

//     return item && { id: item.id, name: item.name };
//   }

//   const items: INamedEntity[] = [];

//   for await (const id of ids) {
//     const item = await dbObject.find(id);

//     item && items.push({ id: item.id, name: item.name });
//   }

//   return items || [];
// }

function getNamedEntity(id: string, dbObject: NamedDBEntities): INamedEntity {
  const item = dbObject.findById(id);

  return item! && { id: item.id, name: item.name };
}

const getListPart = (list: any[], params: Record<string, string | number>) => {
  /* pagination */
  const limitParams = Object.assign({}, params);

  let fromRecord = 0;
  if ('fromRecord' in limitParams && typeof limitParams.fromRecord === 'number') {
    fromRecord = limitParams.fromRecord;
  }

  let toRecord = list.length;
  if ('toRecord' in limitParams && typeof limitParams.toRecord === 'number')
    toRecord = limitParams.toRecord > 0 ? limitParams.toRecord : toRecord;

  return list.slice(fromRecord, toRecord);
};

export { getNamedEntity, getListPart };
