import { IFileIds, IFileSystem, IResponse } from '@lib/types';

import { error, file as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';
import { CustomRequest } from '../robustRequest';

class File extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getFile = async (customRequest: CustomRequest, fileId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'ERROR',
        message: 'Файл не найден',
      } as error.IServerError;
    }

    const res = await customRequest<any>({
      api: this.api.axios,
      method: 'GET',
      url: `/files/${fileId}`,
    });

    if (res?.result) {
      return {
        type: 'GET_FILE',
        file: res?.data,
      } as types.IGetFileResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Данные файла не получены',
    } as error.IServerError;
  };

  getFiles = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_FILES',
        // files: mockFiles,
      } as types.IGetFilesResponse;
    }

    const res = await customRequest<IFileSystem[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/files',
      params,
    });

    if (res?.result) {
      return {
        type: 'GET_FILES',
        files: res?.data || [],
      } as types.IGetFilesResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Данные о файле не получены',
    } as error.IServerError;
  };

  updateFile = async (customRequest: CustomRequest, id: string, file: Partial<any>) => {
    const res = await customRequest<any>({
      api: this.api.axios,
      method: 'PATCH',
      url: `/files/${id}`,
      data: file,
    });

    if (res?.result) {
      return {
        type: 'UPDATE_FILE',
        file: res.data,
      } as types.IUpdateFileResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Данные файла не обновлены',
    } as error.IServerError;
  };

  removeFile = async (customRequest: CustomRequest, fileId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_FILE',
      } as types.IRemoveFileResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/files/${fileId}`,
    });

    if (res?.result) {
      return {
        type: 'REMOVE_FILE',
      } as types.IRemoveFileResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Файл не удален',
    } as error.IServerError;
  };

  removeFiles = async (customRequest: CustomRequest, fileIds: string[]) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_FILES',
      } as types.IRemoveFilesResponse;
    }

    const body: Partial<IFileIds> = { ids: fileIds };

    console.log('body', body);
    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'POST',
      url: '/files/?action=delete',
      data: body,
    });

    if (res?.result) {
      return {
        type: 'REMOVE_FILES',
      } as types.IRemoveFilesResponse;
    }

    return {
      type: res ? 'ERROR' : 'CONNECT_ERROR',
      message: res?.error || 'Файл не удален',
    } as error.IServerError;
  };
}
export default File;
