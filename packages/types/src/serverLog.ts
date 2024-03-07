export interface IServerLogResponse {
  isFinished: boolean;
  textFile: string;
}

export interface IServerLogParams {
  start: number;
  end: number;
}
