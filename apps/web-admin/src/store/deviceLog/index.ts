import asyncActions from './actions.async';
import { deviceLogActions as actions } from './actions';

export { default as deviceLogSelectors } from './selectors';
export const deviceLogActions = { ...asyncActions, ...actions };
