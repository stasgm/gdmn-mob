import { ICompany } from '@lib/types';

export type ICompanyState = {
  readonly list: ICompany[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
