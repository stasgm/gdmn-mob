export type SuccessResponse<T> = {
  result: true;
  type: 'SUCCESS';
  status: number;
  data: T;
};

export type FailureResponse<T = any> = {
  result: false;
  type: 'FAILURE';
  status: number;
  error: string;
  data?: T;
};

export type NoConnection = {
  type: 'NO_CONNECTION';
};

export type ServerTimeout = {
  type: 'SERVER_TIMEOUT';
};

export type ErrorResponse = {
  type: 'INVALID_DATA' | 'ERROR';
};

export type UnAuthorized = {
  type: 'UNAUTHORIZED';
  error: string;
};

export type ServerResponse<T = any> = SuccessResponse<T> | FailureResponse;

export type TResponse<T = any> = ServerResponse<T> | NoConnection | ServerTimeout | ErrorResponse | UnAuthorized;

export type AuthLogOut = () => Promise<any>;
