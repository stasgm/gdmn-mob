import asyncActions from './actions.async';
import { appSystemActions as actions } from './actions';

export { default as appSystemSelectors } from './selectors';
export const appSystemActions = { ...asyncActions, ...actions };
