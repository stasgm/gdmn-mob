import asyncActions from './actions.async';
import { processActions as actions } from './actions';

export { default as processSelectors } from './selectors';
export const processActions = { ...asyncActions, ...actions };
