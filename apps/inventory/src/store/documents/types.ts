export interface IDocument {
  number: number;
}

export type IDocState = {
  readonly docData: IDocument[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
};

export type IDocPayload = Partial<{
  errorMessage: string;
  docData: IDocument[];
}>;
