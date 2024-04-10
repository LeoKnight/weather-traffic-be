import { Controller, Query, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SearchRecordService } from './searchRecord.service';

@Controller('searchRecord')
export class SearchRecordController {
  constructor(private readonly searchRecordService: SearchRecordService) {}

  //   @Get(':timestamp')
  //   getSearchRecordByTimeStampAndPoint(
  //     @Param('timestamp', ParseIntPipe) timestamp: number,
  //     @Query('longitude') longitude: number,
  //     @Query('latitude') latitude: number,
  //   ) {
  //     return this.searchRecordService.getSearchRecordByTimeStampAndLocation(
  //       timestamp,
  //       longitude,
  //       latitude,
  //     );
  //   }
}
