import { IFiles, IAddProcessResponse, IUpdateProcessResponse, AddProcess } from '@lib/types';

import log from '../utils/logger';

import {
  cancelProcess,
  checkProcess,
  completeProcess,
  getFiles,
  getProcessById,
  removeProcessFromList,
  setProcessFailed,
  startProcess,
  updateProcess,
} from './processList';

/**
 * 1. Если есть процесс для данной базы, то возвращает status 'BUSY'
   2. Если нет процесса и нет сообщений для данного клиента, то возвращает status 'OK' и messages = []
   3. Если нет процесса и есть сообщения, то status 'OK', processId и список сообщений
 * @param companyId
 * @param appSystem
 * @param consumerId
 * @returns { status, processId, messages }
 */
export const addProcess = ({ companyId, appSystem, consumerId }: AddProcess): IAddProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = checkProcess(companyId);

  //Если процесс существует, то возвращаем status = BUSY
  if (process) {
    log.warn(`Robust-protocol.updateProcess: процесс ${process.id} занят`);
    return { status: 'BUSY', processId: process.id };
  }

  //Находим список наименований файлов и список сообщений
  const files = getFiles(companyId, appSystem, consumerId);

  // //Если нет процесса и нет сообщений для данного клиента, то status 'OK' и messages = []
  // if (!files) {
  //   return { status: 'IDLE' };
  // }

  //Если нет процесса и есть сообщения, создаем процесс
  const newProcess = startProcess(companyId, appSystem, files);

  return {
    status: 'OK',
    processId: newProcess.id,
    files,
  };
};

export const updateProcessById = (processId: string, processedFiles: IFiles): IUpdateProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не STARTED, то возвращается статус CANCELLED
  if (!process || process.status !== 'STARTED') {
    if (!process) {
      log.warn(`Robust-protocol.updateProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.updateProcess: нельзя изменить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }

  //Если процесс есть в списке в состоянии STARTED, то:
  // 1. Ему присваивается состояние READY_TO_COMMIT.
  // 2. Полученный список ИД обработанных сообщений со статусами их обработки фиксируется в объекте процесса.
  // 3. Формируются файлы и записываются синхронно в папку PREPARED.
  updateProcess(process.id, processedFiles);

  //4. Для сообщений, при обработке которых возникли ошибки, делаются записи в логе системы.
  Object.values(processedFiles).forEach((m) => {
    if (m.status === 'PROCESSED_DEADLOCK' || m.status === 'PROCESSED_INCORRECT') {
      log.warn(`Robust-protocol.updateProcess: сообщение ${m.id} обработано со статусом ${m.status}`);
    }
  });

  return {
    status: 'OK',
  };
};

export const completeProcessById = (processId: string): IUpdateProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не READY_TO_COMMIT,
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'READY_TO_COMMIT') {
    if (!process) {
      log.warn(`Robust-protocol.removeProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.removeProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }

  try {
    //1. Переводим процесс в состояние CLEANUP.
    //2. Полученные файлы переносятся из папки PREPARED в MESSAGES.
    //3. Успешно обработанные файлы переносятся из папки MESSAGES в папку LOG.
    //4. Файлы, при обработке которых возникли ошибки, переносятся из папки MESSAGES в папку ERROR.
    //5. Файлы, при обработке которых возник dead lock, мы не трогаем.
    //   Они будут переданы и обработаны повторно при следующих запросах данных из Гедымина.
    completeProcess(processId);

    // По успешному переносу процесс удаляется из списка процессов.
    removeProcessFromList(processId);
  } catch (err) {
    //Если файлы не удается переместить -- об этом делается запись в логе сервера сообщений.
    //Процесс остается в списке. Его статус меняется на FAILED.
    //Такая ситуация требует вмешательства системного администратора.
    log.error(`Robust-protocol.deleteProcess: процесс ${processId} не удалось удалить`);

    setProcessFailed(process);
  }

  return {
    status: 'OK',
  };
};

export const cancelProcessById = (processId: string, errorMessage: string): IUpdateProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не 'STARTED',
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'READY_TO_COMMIT') {
    if (!process) {
      log.warn(`Robust-protocol.cancelProcess: процесс ${processId} не найден`);
    } else {
      log.warn(`Robust-protocol.cancelProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`);
    }

    return {
      status: 'CANCELLED',
    };
  }
  //Cервер сообщений удаляет процесс из списка процессов и делает соответствующую запись в логе.
  cancelProcess(processId);

  log.warn(`Robust-protocol.cancelProcess: процесс ${processId} отменен, ${errorMessage}`);

  return {
    status: 'OK',
  };
};

export const interruptProcessById = (processId: string, errorMessage: string): IUpdateProcessResponse => {
  //Находим процесс для конкеретной базы
  const process = getProcessById(processId);

  //Если в списке нет процесса с переданным ИД или его состояние не 'STARTED',
  //то возвращается статус CANCELLED
  if (!process || process.status !== 'STARTED') {
    if (!process) {
      log.warn(`Robust-protocol.interruptProcess: процесс ${processId} не найден`);
    } else {
      log.warn(
        `Robust-protocol.interruptProcess: нельзя удалить процесс ${processId}, его состояние ${process.status}`,
      );
    }

    return {
      status: 'CANCELLED',
    };
  }
  //Cервер сообщений удаляет процесс из списка процессов и делает соответствующую запись в логе.
  removeProcessFromList(processId);

  log.warn(`Robust-protocol.interruptProcess: процесс ${processId} прерван, ${errorMessage}`);

  return {
    status: 'OK',
  };
};
