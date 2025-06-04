export class ApiError extends Error {
	constructor(
		public readonly status: number = 500,
		message: string = "Internal Server Error"
	) {
		super(message);
		this.name = "ApiError";
	}
}
