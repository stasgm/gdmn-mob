import { ICompany } from '@lib/types';

export type ICompanyState = {
  readonly companyData: ICompany[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

// export type IDocPayload = Partial<{
//   errorMessage: string;
//   companyData: ICompany[];
// }>;
