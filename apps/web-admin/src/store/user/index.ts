import asyncActions from './actions.async';
import { userActions as actions } from './actions';

export { default as userSelectors } from './selectors';
export const userActions = { ...asyncActions, ...actions };
