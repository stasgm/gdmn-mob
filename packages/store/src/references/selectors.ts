import { IReference } from '@lib/types';

import { useSelector } from '../';

const selectByName = <T>(name: string): IReference<T> => {
  return useSelector((state) => state.references.list[name]);
};

export default { selectByName };
