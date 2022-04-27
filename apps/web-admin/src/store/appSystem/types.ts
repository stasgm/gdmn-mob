import { IAppSystem } from '@lib/types';

import { IPageParam } from '../../types';

export type IAppSystemState = {
  readonly list: IAppSystem[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
