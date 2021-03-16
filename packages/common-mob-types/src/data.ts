export interface IRefData {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}

export interface IReference<T = IRefData> {
  id: number;
  name: string;
  type: string;
  data: T[];
}

export interface IReferences {
  [name: string]: IReference;
}

export interface IContact extends IRefData {
  contactType: number;
}

export interface IGood extends IRefData {
  value?: string;
  // alias?: string;
  // barcode?: string;
  // weightCode?: string;
  // idFrac?: boolean;
}

// export interface IRem extends IGood {
//   remains?: number;
//   price?: number;
// }

// export interface IRemains {
//   contactId: number;
//   date: Date;
//   data: IRemainsData[];
// }

// export interface IRemainsData {
//   goodId: number;
//   q?: number;
//   price?: number;
// }

// /** Model */
// export interface IMGoodRemain extends IGood {
//   remains?: IModelRem[];
// }

// export interface IModelRem {
//   price: number;
//   q: number;
// }

// export interface IMDGoodRemain {
//   contactName: string;
//   goods: IMGoodData<IMGoodRemain>;
// }
