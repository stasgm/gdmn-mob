import * as requests from './src/requests';
import * as types from './src/types';
import { RobustRequest, IRequestParams, robustRequest, CustomRequest } from './src/robustRequest';
import { default as Api } from './src/api';
import { isConnectError } from './src/utils';

export default Api;
export { types, requests, RobustRequest, IRequestParams, robustRequest, CustomRequest, isConnectError };
