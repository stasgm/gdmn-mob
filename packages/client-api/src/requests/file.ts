import { IFileActionResult, IFileParams, ISystemFile } from '@lib/types';

import { error, file as types, BaseApi, BaseRequest } from '../types';
import { response2Log, sleep } from '../utils';
import { CustomRequest } from '../robustRequest';

class File extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  getFiles = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_FILES',
      } as types.IGetFilesResponse;
    }

    const res = await customRequest<ISystemFile[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/files',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_FILES',
        files: res?.data || [],
      } as types.IGetFilesResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные о файле не получены',
    } as error.IServerError;
  };

  getFile = async (customRequest: CustomRequest, id: string, params: Record<string, string | number>) => {
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
      url: `/files/${id}`,
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_FILE',
        file: res?.data,
      } as types.IGetFileResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные файла не получены',
    } as error.IServerError;
  };

  updateFile = async (customRequest: CustomRequest, id: string, params: Record<string, string | number>, data: any) => {
    const res = await customRequest<any>({
      api: this.api.axios,
      method: 'PUT',
      url: `/files/${id}`,
      data,
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'UPDATE_FILE',
        file: res.data,
      } as types.IUpdateFileResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные файла не обновлены',
    } as error.IServerError;
  };

  deleteFile = async (customRequest: CustomRequest, id: string, params: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_FILE',
      } as types.IRemoveFileResponse;
    }

    const res = await customRequest<void>({
      api: this.api.axios,
      method: 'DELETE',
      url: `/files/${id}`,
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_FILE',
      } as types.IRemoveFileResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Файл не удален',
    } as error.IServerError;
  };

  deleteFiles = async (customRequest: CustomRequest, files: IFileParams[]) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_FILES',
      } as types.IRemoveFilesResponse;
    }

    const res = await customRequest<IFileActionResult[]>({
      api: this.api.axios,
      method: 'POST',
      url: '/actions/deleteList',
      data: { files },
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'REMOVE_FILES',
        deletedFiles: res?.data || [],
      } as types.IRemoveFilesResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Файлы не удален',
    } as error.IServerError;
  };

  moveFiles = async (customRequest: CustomRequest, files: IFileParams[], toFolder: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'MOVE_FILES',
      } as types.IMoveFilesResponse;
    }

    const res = await customRequest<IFileActionResult[]>({
      api: this.api.axios,
      method: 'POST',
      url: '/files/actions/moveList',
      data: { files, toFolder },
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'MOVE_FILES',
        movedFiles: res?.data || [],
      } as types.IMoveFilesResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Файлы не перемещены',
    } as error.IServerError;
  };

  getFolders = async (customRequest: CustomRequest, params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_FOLDERS',
      } as types.IGetFoldersResponse;
    }

    const res = await customRequest<string[]>({
      api: this.api.axios,
      method: 'GET',
      url: '/files/folders',
      params,
    });

    if (res.type === 'SUCCESS') {
      return {
        type: 'GET_FOLDERS',
        folders: res?.data || [],
      } as types.IGetFoldersResponse;
    }

    return {
      type: res.type,
      message: response2Log(res) || 'Данные о папках не получены',
    } as error.IServerError;
  };
}

export default File;
