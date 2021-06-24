import { ApplicationException } from './application.exception';
/**
 * Exception when one of the request parameters is invalid
 */
export class ConflictException extends ApplicationException {
  /**
   * Exception constructor
   * @param context Request context and more details
   */
  constructor(context: string) {
    super('DataConflictException', 409, context);
  }
}
