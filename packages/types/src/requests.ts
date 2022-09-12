export interface IResponse<T = undefined> {
  result: boolean;
  status?: number;
  error?: string;
  data?: T;
}

export type AuthLogOut = () => Promise<any>;
