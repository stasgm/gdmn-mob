import { ApplicationException } from './application.exception';

/**
 * Exception when Unauthorized request
 */
export class UnauthorizedException extends ApplicationException {
  /**
   * Exception constructor
   * @param context Request context and more details
   */
  constructor(context: string) {
    super('UnauthorizedException', 401, context);
  }
}
