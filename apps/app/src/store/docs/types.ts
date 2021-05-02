export interface IDocument {
  number: string;
  documentdate: string;
}
// export interface ILoadingState {
//   readonly loading: boolean;
//   readonly errorMessage: string;
// }

export type IDocState = {
  readonly docData: IDocument[];
  readonly loading: boolean;
  readonly errorMessage: string;
};
