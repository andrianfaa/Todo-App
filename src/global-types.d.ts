declare global {
  interface HttpResponse<T> {
    status: string;
    statusCode: number | string;
    message: string;
    data: T;
  }
}

export {};
