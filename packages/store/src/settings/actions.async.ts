import { ThunkAction } from 'redux-thunk';

import { ISettings } from '@lib/types';

import { SettingsActionType, actions } from './actions';
import { ISettingsState } from './types';

type AppThunk = ThunkAction<Promise<SettingsActionType>, ISettingsState, null, SettingsActionType>;

const addSettings = (settings: ISettings): AppThunk => {
  return async (dispatch) => {
    dispatch(actions.addSettingsAsync.request(''));

    //TODO: проверка
    if (settings) {
      return dispatch(actions.addSettingsAsync.success(settings));
    }

    return dispatch(actions.addSettingsAsync.failure('something wrong'));
  };
};

export default { addSettings };
