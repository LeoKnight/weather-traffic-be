import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { TYPEORM_ERROR_COMMON_MESSAGE } from 'src/constants/message';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = exception.message.message;

    Logger.error(message, exception.stack, `${request.method} ${request.url}`);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.constructor) {
      case BadRequestException:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        break;
      case UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED;
        message = exception.message;
        break;
      case NotFoundException:
        status = HttpStatus.NOT_FOUND;
        message = exception.message;
        break;
      case HttpException:
        status = exception.getStatus();
        break;
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = TYPEORM_ERROR_COMMON_MESSAGE;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = TYPEORM_ERROR_COMMON_MESSAGE;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = TYPEORM_ERROR_COMMON_MESSAGE;
        break;
      case ServiceUnavailableException:
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = TYPEORM_ERROR_COMMON_MESSAGE;
        break;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
