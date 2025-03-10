import { IFolderList, ISystemFile } from '@lib/types';

import { IFilePageParam } from '../../types';

export type ISystemFileState = {
  readonly list: ISystemFile[];
  readonly folders: IFolderList[];
  readonly file: any;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IFilePageParam;
};
