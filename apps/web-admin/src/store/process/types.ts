import { IProcess } from '@lib/types';

import { IPageParam } from '../../types';

export type IProcessState = {
  readonly list: IProcess[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
