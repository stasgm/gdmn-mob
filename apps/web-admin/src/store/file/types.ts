import { IFileSystem } from '@lib/types';

import { IFilePageParam } from '../../types';

export type IFileSystemState = {
  readonly list: IFileSystem[];
  readonly file: any;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IFilePageParam;
};
