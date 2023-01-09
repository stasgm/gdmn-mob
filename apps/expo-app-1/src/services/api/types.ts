export interface IApiResponse<T> {
  success: boolean;
  data: T;
}

export interface IErrorMessage {
  error: string;
  message?: string[];
}

export interface IApiErrorResponse extends IApiResponse<IErrorMessage> {
  success: false;
}

export interface IServerError {
  type: 'ERROR';
  message: string;
}

export type ValidationErrors = {
  errorMessage: string;
  fieldErrors: Record<string, string>;
};
