import { IUserDocument } from '@lib/types';

export type IDocumentState = {
  readonly list: IUserDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
