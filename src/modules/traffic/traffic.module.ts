import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Traffic } from './entities/traffic.entity';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { SearchRecordModule } from '../searchRecord/searchRecord.module';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Traffic]),
    HttpModule,
    SearchRecordModule,
    CacheModule.register({
      ttl: 60 * 60, // 1hr
      max: 10, // maximum number of items in cache
    }),
  ],
  providers: [TrafficService, ExternalApiService],
  controllers: [TrafficController],
})
export class TrafficModule {}
