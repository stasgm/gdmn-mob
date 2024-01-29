export interface IErpLogRequestBody {
  companyId: string;
  appSystemId: string;
}

export interface IErpLogFile {
  filepath: string;
}

export interface IErpLogFileRequest extends Request {
  files: {
    logFile: IErpLogFile;
  };
}

export interface IErpLogResponse {
  isFinished: boolean;
  textFile: string;
}
