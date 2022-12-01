import { IFileSystem, IResponse } from '@lib/types';

import { error, file as types } from '../types';
import { getParams, sleep } from '../utils';
import { BaseApi } from '../types/BaseApi';
import { BaseRequest } from '../types/BaseRequest';

class File extends BaseRequest {
  constructor(api: BaseApi) {
    super(api);
  }

  // addFile = async (companyId: string, appSystemId: string, file: IDeviceLog[]) => {
  //   if (this.api.config.debug?.isMock) {
  //     await sleep(this.api.config.debug?.mockDelay || 0);

  //     return {
  //       type: 'ADD_FILE',
  //     } as types.IAddFileResponse;
  //   }

  //   try {
  //     const body: IDeviceLogParams = {
  //       companyId,
  //       appSystemId,
  //       deviceLog: file,
  //     };
  //     const res = await this.api.axios.post<IResponse<void>>('/files/', body);
  //     const resData = res.data;

  //     if (resData.result) {
  //       return {
  //         type: 'ADD_FILE',
  //       } as types.IAddFileResponse;
  //     }

  //     return {
  //       type: 'ERROR',
  //       message: resData.error,
  //     } as error.INetworkError;
  //   } catch (err) {
  //     return {
  //       type: 'ERROR',
  //       message: err instanceof TypeError ? err.message : 'ошибка сохранения файла',
  //     } as error.INetworkError;
  //   }
  // };

  getFile = async (fileId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      // const file = mocFiles.find((item) => item.id === fileId);

      // if (file) {
      //   return {
      //     type: 'GET_FILE',
      //     file,
      //   } as types.IGetFileResponse;
      // }

      return {
        type: 'ERROR',
        message: 'Файл не найден',
      } as error.INetworkError;
    }

    try {
      const res = await this.api.axios.get<IResponse<any>>(`/files/${fileId}`);
      const resData = res.data;
      console.log('ress', res.data);

      if (resData.result) {
        return {
          type: 'GET_FILE',
          file: resData?.data || [],
        } as types.IGetFileResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о файле',
      } as error.INetworkError;
    }
  };

  getFiles = async (params?: Record<string, string | number>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'GET_FILES',
        // files: mockFiles,
      } as types.IGetFilesResponse;
    }

    let paramText = params ? getParams(params) : '';

    if (paramText > '') {
      paramText = `?${paramText}`;
    }

    try {
      const res = await this.api.axios.get<IResponse<IFileSystem[]>>(`/files${paramText}`);

      ///${this.api.config.version}
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'GET_FILES',
          files: resData?.data || [],
        } as types.IGetFilesResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error || 'ошибка получения данных о файлах',
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка получения данных о файлах',
      } as error.INetworkError;
    }
  };

  updateFile = async (file: Partial<any>) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'UPDATE_FILE',
        file: { ...file, editionDate: new Date().toISOString() },
      } as types.IUpdateFileResponse;
    }

    try {
      const res = await this.api.axios.patch<IResponse<any>>(`/files/${file.id}`, file);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'UPDATE_FILE',
          file: resData.data,
        } as types.IUpdateFileResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка обновления файла',
      } as error.INetworkError;
    }
  };

  removeFile = async (fileId: string) => {
    if (this.api.config.debug?.isMock) {
      await sleep(this.api.config.debug?.mockDelay || 0);

      return {
        type: 'REMOVE_FILE',
      } as types.IRemoveFileResponse;
    }

    try {
      const res = await this.api.axios.delete<IResponse<void>>(`/files/${fileId}`);
      const resData = res.data;

      if (resData.result) {
        return {
          type: 'REMOVE_FILE',
        } as types.IRemoveFileResponse;
      }

      return {
        type: 'ERROR',
        message: resData.error,
      } as error.INetworkError;
    } catch (err) {
      return {
        type: 'ERROR',
        message: err instanceof TypeError ? err.message : 'ошибка удаления файла',
      } as error.INetworkError;
    }
  };
}
export default File;
