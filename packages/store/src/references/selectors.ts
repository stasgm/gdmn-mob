import { IReference } from '@lib/types';

import { useSelector } from '../';

const selectByName = <T>(name: string): IReference<T> => {
  return useSelector((state) => state.references?.list[name]);
};

const selectByRefId = <T>(name: string, id: string): T => {
  return useSelector((state) => state.references?.list[name]?.data.find((i) => i.id === id));
};

export default { selectByName, selectByRefId };
