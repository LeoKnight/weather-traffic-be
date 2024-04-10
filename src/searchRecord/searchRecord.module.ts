import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SearchRecord } from './entities/searchRecord.entity';
import { SearchRecordService } from './searchRecord.service';
import { SearchRecordController } from './searchRecord.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SearchRecord])],
  providers: [SearchRecordService],
  controllers: [SearchRecordController],
  exports: [SearchRecordService],
})
export class SearchRecordModule {}
