export class ApiResponse<T> {
  code: number;
  message: string;
  data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static created<T>({ data, message }: { data: T; message: string }): ApiResponse<T> {
    return new ApiResponse<T>(201, message, data);
  }

  static success<T>({ data, message }: { data: T; message: string }): ApiResponse<T> {
    return new ApiResponse<T>(200, message, data);
  }

  static error({ message, code }: { message: string; code: number }): ApiResponse<null> {
    return new ApiResponse<null>(code, message, null);
  }
}

export type DataResponse<T> = ApiResponse<T>;
