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
  remains?: number;
}

export interface IDocumentStatus {
  id: number;
  name: string;
}
