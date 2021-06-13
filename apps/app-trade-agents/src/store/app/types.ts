export interface IFormParam {
  [fieldName: string]: unknown;
}

export interface IAppState {
  formParams?: IFormParam;
}

// export interface IAppParams extends Partial<
// >;
