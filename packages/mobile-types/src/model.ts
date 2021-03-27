export interface IModelData<T = unknown> {
  [id: string]: T;
}

export interface IMGoodData<T = unknown> {
  [id: string]: T;
}

export interface IModel<T = IModelData> {
  // id: number;
  name: string;
  type: string;
  data: T;
}

export interface IModels {
  [name: string]: IModel;
}
