export interface IDocument {
  number: number;
}

export type IDocState = {
  readonly list: IDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
