import { ISystemFile } from '@lib/types';

import { IFilePageParam } from '../../types';

export type ISystemFileState = {
  readonly list: ISystemFile[];
  readonly folders: string[];
  readonly file: any;
  readonly loading: boolean;
  readonly errorMessage: string;
  readonly pageParams?: IFilePageParam;
};
