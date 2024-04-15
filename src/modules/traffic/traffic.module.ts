import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Traffic } from './entities/traffic.entity';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { SearchRecordModule } from '../searchRecord/searchRecord.module';
// import { ExternalApiService } from 'src/modules/external-api/external-api.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalApiModule } from '../external-api/external-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Traffic]),
    SearchRecordModule,
    CacheModule.register({
      ttl: 60 * 60, // 1hr
      max: 10, // maximum number of items in cache
    }),
    ExternalApiModule,
  ],
  providers: [
    TrafficService,
    // , ExternalApiService
  ],
  controllers: [TrafficController],
})
export class TrafficModule {}
