import { Injectable } from '@nestjs/common';

@Injectable()
export class AutheService {
  static sessionId: string;
}
