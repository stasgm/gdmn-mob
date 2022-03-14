export interface IField {
  id: string;
  value: string;
}

export interface IListItem {
  id: string;
  value: string;
  [key: string]: unknown;
}

export interface IDocumentParams {
  status: number;
  date?: string;
  doctype?: number;
  docnumber?: string;
}

export interface IFilterParams {
  fieldSearch: string[];
}
