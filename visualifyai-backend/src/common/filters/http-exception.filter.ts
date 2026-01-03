import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../response/api-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    console.log('exceptionResponse', exceptionResponse);
    let message = 'Something went wrong';

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      message = Array.isArray(exceptionResponse['message'])
        ? exceptionResponse['message'][0]
        : exceptionResponse['message'];
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const errorResponse = ApiResponse.error({ message, code: status });

    response.status(status).json(errorResponse);
  }
}
