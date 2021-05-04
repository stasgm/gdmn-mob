import asyncActions from './actions.async';
import * as actions from './actions';
export { default as reducer } from './reducer';

export default { ...asyncActions, ...actions };
