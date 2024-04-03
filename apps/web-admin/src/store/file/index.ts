import asyncActions from './actions.async';
import { systemFileActions as actions } from './actions';

export { default as fileSelectors } from './selectors';
export const fileActions = { ...asyncActions, ...actions };
