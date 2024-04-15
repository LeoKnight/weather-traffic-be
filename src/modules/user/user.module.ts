import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSearchLog } from './entity/UserSearchLog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSearchLog])],
})
export class UserModule {}
