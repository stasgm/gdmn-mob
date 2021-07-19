export interface IHeadCells<T> {
  id: keyof T;
  label: string;
  sortEnable?: boolean;
}
