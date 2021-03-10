export interface IField {
  id: string;
  value: string;
}

export interface IListItem {
  id?: number;
  value?: string;
  [key: string]: unknown;
}

export interface IFormParams {
  contact?: number[];
  dateBegin?: string;
  dateEnd?: string;
}

export interface IDocumentParams {
  status: number;
  date?: string;
  tocontactId?: number;
  fromcontactId?: number;
  doctype?: number;
  docnumber?: string;
}

export interface IFilterParams {
  fieldSearch: string[];
}
