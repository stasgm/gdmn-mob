import { IReference } from '@lib/types';

import { useSelector } from '../';

const selectByName = <T>(name: string): IReference<T> => {
  return useSelector((state) => state.references?.list[name]);
};

const selectByRefId = <T>(name: string, id?: string) => {
  return useSelector((state) => state.references?.list[name]?.data?.find((i) => i.id === id)) as T | undefined;
};
export default { selectByName, selectByRefId };
