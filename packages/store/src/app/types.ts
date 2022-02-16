export interface IFormParam {
  [fieldName: string]: any;
}

export interface IAppState {
  loading: boolean;
  errorMessage: string;
  errorList: string[];
  formParams?: IFormParam;
}

// export interface IApplFormParam extends IFormParam {
//   date: Date;
// }
