export type SuccessResponse<T> = {
  type: 'SUCCESS';
  status: number;
  data: T;
};

export type FailureResponse = {
  type: 'FAILURE';
  status: number;
  error: string;
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

export type ServerResponse<T = any> = SuccessResponse<T> | FailureResponse;

export type TResponse<T = any> = ServerResponse<T> | NoConnection | ServerTimeout | ErrorResponse;

export type AuthLogOut = () => Promise<any>;
