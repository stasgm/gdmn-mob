import asyncActions from './actions.async';
import { processActions } from './actions';

export default { ...asyncActions, ...processActions };
