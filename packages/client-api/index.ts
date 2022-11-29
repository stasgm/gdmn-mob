import * as requests from './src/requests';
import * as types from './src/types';
import {
  RobustRequest,
  IRequestParams,
  CustomRequestProps,
  robustRequest,
  CustomRequest,
  IServerUnreacheableResult,
} from './src/robustRequest';
import { default as Api } from './src/api';

export default Api;
export {
  types,
  requests,
  RobustRequest,
  IRequestParams,
  robustRequest,
  CustomRequest,
  CustomRequestProps,
  IServerUnreacheableResult,
};
