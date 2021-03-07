export interface IResponse<T = undefined> {
  result: boolean;
  error?: string;
  data?: T;
}

export interface IDataFetch {
  isLoading: boolean;
  isError: boolean;
  status?: string;
}
