/**
 * Parent application exception
 */
export class ApplicationException extends Error {
  /** Status, code of the exception */
  public status: number;

  constructor(name: string, status: number, message: string) {
    super(message);
    this.name = name;
    this.status = status;
  }

  public toString(): string {
    const stackString = this.status === 401 || !this.stack ? '' : `\n${this.stack}`;
    return `${this.name} (${this.status}): ${this.message}${stackString}`;
  }
}
