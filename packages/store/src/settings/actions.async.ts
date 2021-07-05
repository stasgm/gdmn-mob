import { ThunkAction } from 'redux-thunk';

// import api from '@lib/client-api';

import { SettingsActionType, actions } from './actions';
import { ISettingsState } from './types';

type AppThunk = ThunkAction<Promise<SettingsActionType>, ISettingsState, null, SettingsActionType>;

const fetchSettings = (): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.fetchSettingsAsync.request(''));
    // Извлекается из сообщений

    /*  const response = await api.message.getMessages({ systemName: systemId, companyId });

     if (response.type === 'GET_MESSAGES') {
       return dispatch(actions.fetchSettingsAsync.success(response.messageList));
     }

     if (response.type === 'ERROR') {
       return dispatch(actions.fetchSettingsAsync.failure(response.message));
     }
  */
    return dispatch(actions.fetchSettingsAsync.failure('something wrong'));
  };
};

export default { fetchSettings };
