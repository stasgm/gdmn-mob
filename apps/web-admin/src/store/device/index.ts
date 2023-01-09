import asyncActions from './actions.async';
import { deviceActions } from './actions';

export default { ...asyncActions, ...deviceActions };
