export interface IParamsInfo {
  [key: string]: {
    itemKey: string;
    value?: string | number | Date;
    property?: string;
    fullMatch?: boolean;
    comparator?: (a: number, b: number) => boolean;
  };
}
