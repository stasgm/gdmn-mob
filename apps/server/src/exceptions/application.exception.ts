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
    return this.status === 401 || !this.stack
      ? `${this.name} (${this.status}): ${this.message}`
      : `${this.status} ${this.stack}`;
  }
}
