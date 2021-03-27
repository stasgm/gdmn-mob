import asyncActions from './actions.async';
import * as actions from './actions';

export default { ...asyncActions, ...actions };
