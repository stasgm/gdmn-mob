import { ICompany } from '@lib/types';

import { IPageParam } from '../../types';

export type ICompanyState = {
  readonly list: ICompany[];
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IPageParam;
};
