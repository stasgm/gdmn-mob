export default class ApiErrorRet extends Error {
  status: number;
  name: string;
  constructor(status: number, name: string, message: string) {
    super(message);
    this.status = status;
    this.name = name;
  }

  public toString(): string {
    return `${this.name} (${this.status}): ${this.message}\n${this.stack || ''}`;
  }

  static UnauthorizedError(): ApiErrorRet {
    return new ApiErrorRet(401, 'Пользователь не авторизован', 'UnauthorizedError');
  }

  static BadRequest(message: string, name = 'BadRequest'): ApiErrorRet {
    return new ApiErrorRet(400, name, message);
  }

  static DataNotFound(message: string, name = 'DataNotFound'): ApiErrorRet {
    return new ApiErrorRet(404, name, message);
  }
}
