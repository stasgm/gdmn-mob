import { documentActions, useAppStore, useDispatch, useDocThunkDispatch } from '@lib/store';
import { ISettingsOption, StatusType } from '@lib/types';

import { useCallback } from 'react';

import { getDateString, addError, getRootState, addRequestNotice } from './utils';

export const useDeleteOldDocs = () => {
  const dispatch = useDispatch();
  const docDispatch = useDocThunkDispatch();
  const store = useAppStore();

  return useCallback(async () => {
    const settings = getRootState(store).settings.data;
    const documents = getRootState(store).documents.list;

    const cleanDocTime = (settings.cleanDocTime as ISettingsOption<number>).data || 0;
    const cleanDefaultDocTime = (settings.cleanDefaultDocTime as ISettingsOption<number>)?.data || 7;
    const cleanDraftDocTime = (settings.cleanDraftDocTime as ISettingsOption<number>)?.data || 0;
    const cleanReadyDocTime = (settings.cleanReadyDocTime as ISettingsOption<number>)?.data || 0;
    const cleanSentDocTime = (settings.cleanSentDocTime as ISettingsOption<number>)?.data || 0;

    const removeDocumentsByStatus = async (status: StatusType, cleanTime: number, message: string) => {
      if (cleanTime < cleanDefaultDocTime) {
        return;
      }

      const maxDocDate = new Date();
      maxDocDate.setDate(maxDocDate.getDate() - cleanTime);

      const delDocs = documents
        .filter((d) => d.status === status && new Date(d.documentDate).getTime() <= maxDocDate.getTime())
        .map((d) => d.id);

      //TODO: Добавить логирование действий
      if (delDocs.length === 0) {
        return;
      }

      addRequestNotice(
        dispatch,
        `Удаление документов со статусом "${message}", дата которых менее ${getDateString(maxDocDate)}`,
      );

      const delDocResponse = await docDispatch(documentActions.removeDocuments(delDocs));
      if (delDocResponse.type === 'DOCUMENTS/REMOVE_MANY_FAILURE') {
        addError(
          dispatch,
          'useDeleteOldDocs',
          `Документы со статусом "${message}", дата которых менее ${getDateString(maxDocDate)}, не удалены`,
          'useDeleteOldDocs',
          false,
        );
      }
    };

    await removeDocumentsByStatus('DRAFT', cleanDraftDocTime, 'Черновики');
    await removeDocumentsByStatus('READY', cleanReadyDocTime, 'Готовые к отправке');
    await removeDocumentsByStatus('SENT', cleanSentDocTime, 'Отправленные');
    await removeDocumentsByStatus('PROCESSED', cleanDocTime, 'Обработанные');
    await removeDocumentsByStatus('ARCHIVE', cleanDocTime, 'Архивные');
  }, [dispatch, docDispatch, store]);
};
