export interface IDocument {
  number: number;
}
// export interface ILoadingState {
//   readonly loading: boolean;
//   readonly errorMessage: string;
// }

export interface IFilterOption {
  orderNum: number;
  name: keyof IDocument;
  value?: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface IDocState {
  readonly docData: IDocument[] | undefined;
  readonly filter: IFilterOption[] | undefined;
  readonly loading: boolean;
  readonly errorMessage: string;
}

export type DocPayload = Partial<{
  errorMessage: string;
  docData: IDocument[];
}>;
