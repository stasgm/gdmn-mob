import asyncActions from './actions.async';
import { companyActions as actions } from './actions';

export { default as companySelectors } from './selectors';
export const companyActions = { ...asyncActions, ...actions };
