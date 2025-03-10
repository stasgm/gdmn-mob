export interface IErpLogRequestBody {
  companyId: string;
  appSystemId: string;
}

export interface IErpLogFile {
  filepath: string;
}

export interface IErpLogFileAddRequest extends Request {
  files: {
    logFile: IErpLogFile;
  };
}
