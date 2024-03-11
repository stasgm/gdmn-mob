import { IServerLogFile } from '@lib/types';

import { IPageParam } from '../../types';

export type IServerLogState = {
  readonly list: IServerLogFile[];
  readonly serverLog?: string;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
