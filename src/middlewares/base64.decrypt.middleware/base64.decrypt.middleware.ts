import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * This is where we will base64 decode the params dynamically 
 */
@Injectable()
export class Base64DecryptMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'GET') {
      this.decryptParams(req.query);
    } else if (req.method === 'POST') {
      this.decryptParams(req.body);
    }

    next();
  }

  private decryptParams(params: Record<string, any>) {
    for (const key in params) {
      if (params.hasOwnProperty(key) && typeof params[key] === 'string') {
        try {
          params[key] = atob(params[key]);
        } catch (error) {
          // Expecting all params to be base64 encoded, hence throwing error
          throw new BadRequestException("Bad request");
        }
      }
    }
  }
}
