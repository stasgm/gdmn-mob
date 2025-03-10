import { ServerInfo, ServerLogFile } from '@lib/types';

import { IPageParam } from '../../types';

export type IServerLogState = {
  readonly list: ServerLogFile[];
  readonly serverLog?: string;
  readonly serverInfo?: ServerInfo;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
