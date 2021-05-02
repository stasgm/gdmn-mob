export interface IDocument {
  number: string;
  documentdate: string;
}

export type IDocState = {
  readonly docData: IDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
