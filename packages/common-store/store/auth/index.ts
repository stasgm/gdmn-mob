import { default as asyncActions } from './actions.async';
import * as actions from './actions';

export default { ...asyncActions, ...actions };
