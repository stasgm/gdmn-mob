import { IErrorNotice } from '@lib/store';

export interface IFileNoticeInfo {
  producerId: string;
  deviceId: string;
}

export interface IPathParams {
  companyId: string;
  appSystemId: string;
}

export interface INoticeParams extends IPathParams {
  errorNotice: IErrorNotice[];
}
