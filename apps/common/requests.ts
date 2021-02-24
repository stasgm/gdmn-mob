export interface IResponse<T = undefined> {
  result: boolean;
  error?: string;
  data?: T;
}
