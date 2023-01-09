import { customAlphabet } from 'nanoid';

const extraPredicate = (item: any, params: Record<string, string>) => {
  let matched = 0;

  const paramsEntries = Object.entries(params);

  for (const [param, value] of paramsEntries) {
    if (param in item) {
      if (((item as any)[param] as string).toUpperCase() === value.toUpperCase()) {
        matched++;
      } else {
        break;
      }
    }
  }
  return matched === paramsEntries.length;
};

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

const generateId = () => {
  return customAlphabet('1234567890abcdef', 10)();
};

export { extraPredicate, getListPart, generateId };
