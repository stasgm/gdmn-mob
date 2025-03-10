import asyncActions from './actions.async';
import { erpLogActions as actions } from './actions';

export const erpLogActions = { ...asyncActions, ...actions };
