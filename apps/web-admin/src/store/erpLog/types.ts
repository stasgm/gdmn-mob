import { IErpLogFile } from '@lib/types';

export type IErpLogState = {
  readonly list: IErpLogFile[];
  readonly erpLog?: string;
  readonly loading: boolean;
  readonly errorMessage: string;
};
