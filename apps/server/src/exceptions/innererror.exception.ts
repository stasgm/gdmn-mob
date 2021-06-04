import { ApplicationException } from './application.exception';

/**
 * Exception when we can't find data for a database request
 */
export class InnerErrorException extends ApplicationException {
  /**
   * Exception constructor
   * @param context Request context and more details
   */
  constructor(context: string) {
    super('InnerErrorException', 500, context);
  }
}
