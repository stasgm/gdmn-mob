import { IReference } from '@lib/types';

import { useProxySelector } from '../';

const selectByName = <T>(name: string) =>
  useProxySelector<IReference<T>>((state) => state.references?.list[name], [name]);

const selectByRefId = <T>(name: string, id?: string) =>
  useProxySelector<T | undefined>((state) => state.references?.list[name]?.data?.find((i: any) => i.id === id), [name]);

export default { selectByName, selectByRefId };
