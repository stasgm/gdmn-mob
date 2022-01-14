import asyncActions from './actions.async';
import { actions } from './actions';

export { default as reducer, baseSettingGroup } from './reducer';
export { SettingsActionType } from './actions';
export { useSettingThunkDispatch } from './actions.async';
export default { ...asyncActions, ...actions };
