import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { USER_ID_COOKIE_NAME } from 'src/common/constants';
import { AutheService } from 'src/global-service/auth-service/auth.service';
import { decryptData } from 'src/utils';
import { Request, Response, NextFunction } from 'express';

/**
 * user authentication
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const userIdCookie = decryptData(req.cookies[USER_ID_COOKIE_NAME]);
      if (!isNotEmpty(userIdCookie)) {
        throw Error('empty cookie');
      }

      // authorised
      AutheService.sessionId = userIdCookie;

      next();
    } catch (err) {
      Logger.error(err);
    }
  }
}
