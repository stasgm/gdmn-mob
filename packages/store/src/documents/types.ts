export interface IDocument {
  number: number;
}

export type IDocumentState = {
  readonly list: IDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
