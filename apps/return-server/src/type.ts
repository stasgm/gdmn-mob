export type IParams = (string | Date | number)[];

export type IRecordObject = {
  [name: string]: string;
};
export interface IResponse<T = undefined> {
  result: boolean;
  error?: string;
  data?: T;
}
