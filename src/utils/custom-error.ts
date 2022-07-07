class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  getMessage(): { message: string } {
    return { message: this.message };
  }
}

export default CustomError;
