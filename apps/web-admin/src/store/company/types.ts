import { ICompany } from '@lib/client-types';

export type ICompanyState = {
  readonly list: ICompany[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};
