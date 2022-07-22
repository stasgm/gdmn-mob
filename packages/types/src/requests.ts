export interface IResponse<T = undefined> {
  result: boolean;
  status?: number;
  error?: string;
  data?: T;
}
