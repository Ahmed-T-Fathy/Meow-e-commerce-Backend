import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() 
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; 
    let errorMessage = 'Internal server error'; 

    if (exception.code === 'ENOENT') {
      status = HttpStatus.NOT_FOUND; 
      errorMessage = 'File or directory not found';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorMessage = exception.message || 'An error occurred';
    }

    this.logger.error(`${request.method} ${request.originalUrl} ${status} error: ${errorMessage}`);
    const errorDetails=exception.getResponse().message;
    // console.log(exception.getResponse());
    
    response.status(status).json({
      statusCode: status,
      error: true,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorDetails
    });
  }
}
