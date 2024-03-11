export interface IErpLogQueryResponse {
  type: 'GET_ERPLOG';
}

export interface IGetErpLogResponse extends IErpLogQueryResponse {
  type: 'GET_ERPLOG';
  erpLog: string;
}
