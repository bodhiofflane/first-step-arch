export class HTTPError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public context?: string,
  ) {
    super(message);
  }
}
