export interface IReferences {
  [name: string]: IReference;
}

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

export interface IContact extends IRefData {
  contactType: number;
}

export interface IGood extends IRefData {
  alias?: string;
  barcode?: string;
  value?: string;
  weightCode?: string;
  idFrac?: boolean;
}

export interface IRem extends IGood {
  remains?: number;
  price?: number;
}

export interface IRemains {
  contactId: number;
  date: Date;
  data: IRemainsData[];
}

export interface IRemainsData {
  goodId: number;
  q?: number;
  price?: number;
}

/** Model */
export interface IMGoodRemain extends IGood {
  remains?: IModelRem[];
}

export interface IModelRem {
  price: number;
  q: number;
}

export interface IMDGoodRemain {
  contactName: string;
  goods: IMGoodData<IMGoodRemain>;
}

export interface IModelData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IModel<T = IModelData> {
  //id: number;
  name: string;
  type: string;
  data: T;
}

export interface IModels {
  [name: string]: IModel;
}

//{ name: 'Модель остатков', type: ModelTypes.REMAINS, data: {[1234]: {contactname, goods: {[111]: {name, alias, remains: []} }, [12346]: {}} }

// eslint-disable-next-line no-shadow
// export enum ModelTypes {
//   REMAINS = "remains",
// }
