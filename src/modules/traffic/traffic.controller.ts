import { Controller, Query, Get, UseFilters } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficRequest } from './dto/traffic.dto';
import { ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '../../filters/global.exception/global.exception.filter';

@ApiTags('Traffic')
@UseFilters(new GlobalExceptionFilter())
@Controller('api/traffic')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Get()
  async getTrafficImageByTimeStampAndPoint(@Query() query: TrafficRequest) {
    const { date_time, longitude, latitude, location } = query;

    return await this.trafficService.getTrafficByDateAndLocation(
      date_time,
      longitude,
      latitude,
      location,
    );
  }
}
