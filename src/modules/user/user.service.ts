import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AutheService } from 'src/global-service/auth-service/auth.service';
import { UserSearchLog } from './entity/UserSearchLog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserSearchLog)
    private usersSearchesRepository: Repository<UserSearchLog>,
  ) {}

  async getUsersRecentSearchByUser(): Promise<UserSearchLog[]> {
    return await this.usersSearchesRepository
      .createQueryBuilder()
      .select('search_date_time, location')
      .where('user_id=:id', { id: AutheService.sessionId })
      .orderBy('created_date', 'DESC')
      .limit(2)
      .getRawMany();
  }

  async getUsersRecentSearchByOthers(): Promise<UserSearchLog[]> {
    return await this.usersSearchesRepository
      .createQueryBuilder()
      .select('search_date_time, location')
      .where('user_id<>:id', { id: AutheService.sessionId })
      .orderBy('created_date', 'DESC')
      .limit(2)
      .getRawMany();
  }
}
