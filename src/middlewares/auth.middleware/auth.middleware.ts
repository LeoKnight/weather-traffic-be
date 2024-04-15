import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AutheService } from 'src/global-service/auth-service/auth.service';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * user authentication
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.cookies.userId) {
        const userId = uuidv4();
        res.cookie('userId', userId, { httpOnly: true });
        AutheService.sessionId = userId;
      } else {
        AutheService.sessionId = req.cookies.userId;
      }
      next();
    } catch (err) {
      Logger.error(err);
    }
  }
}
