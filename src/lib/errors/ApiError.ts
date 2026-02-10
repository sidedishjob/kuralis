export class ApiError extends Error {
  constructor(
    public readonly status: number = 500,
    message: string = "Internal Server Error",
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
