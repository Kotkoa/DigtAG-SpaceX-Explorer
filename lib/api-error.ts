interface ApiErrorOptions {
  statusCode: number;
  message: string;
}

export class ApiError extends Error {
  readonly statusCode: number;

  constructor({ statusCode, message }: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
