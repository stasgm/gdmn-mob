import { INamedEntity } from '@lib/types';

import { NamedDBEntities } from './db';

async function getNamedEntity(ids: string, dbObject: NamedDBEntities): Promise<INamedEntity>;
async function getNamedEntity(ids: string[], dbObject: NamedDBEntities): Promise<INamedEntity[]>;
async function getNamedEntity(
  ids: string | string[],
  dbObject: NamedDBEntities,
): Promise<INamedEntity | INamedEntity[]> {
  if (typeof ids === 'string') {
    const item = await dbObject.find(ids);

    return item && { id: item.id, name: item.name };
  }

  const items: INamedEntity[] = [];

  for await (const id of ids) {
    const item = await dbObject.find(id);

    item && items.push({ id: item.id, name: item.name });
  }

  return items || [];
}

export { getNamedEntity };
