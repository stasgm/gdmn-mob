import { ICompany } from '@lib/client-types';

export type ICompanyState = {
  readonly list: ICompany[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
