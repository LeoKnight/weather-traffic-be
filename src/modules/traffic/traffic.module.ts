import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Traffic } from './entities/traffic.entity';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { SearchRecordModule } from '../searchRecord/searchRecord.module';

@Module({
  imports: [TypeOrmModule.forFeature([Traffic]), SearchRecordModule],
  providers: [TrafficService],
  controllers: [TrafficController],
})
export class TrafficModule {}
