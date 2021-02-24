export interface IDocument {
  id: number;
  head: IHead;
  lines: ILine[];
}

export interface IHead {
  docnumber: string;
  doctype: number;
  fromcontactId: number;
  tocontactId: number;
  date: string;
  status: number;
}

export interface ILine {
  id: number;
  goodId: number;
  quantity: number;
  price?: number;
  remains?: number
}

export interface IRefData {
  id: number;
  name?: string;
  [fieldName: string]: unknown;
}

export interface IForm {
  [name: string]: unknown;
}

export interface IViewParam {
  [name: string]: unknown;
}

export interface ICompanySetting {
  [name: string]: unknown;
}

export interface IWeightCodeSettings {
  weightCode: string;
  code: number;
  weight: number;
}

export interface IReference<T = IRefData> {
  id: number;
  name: string;
  type: string;
  data: T[];
}

export interface IDocumentMessage {
  name: string;
  data: IDocument[];
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

export interface IDocumentStatus {
  id: number;
  name: string;
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


//{ name: 'Модель остатков', type: ModelTypes.REMAINS, data: {[1234]: {contactname, goods: {[111]: {name, alias, remains: []} }, [12346]: {}} }