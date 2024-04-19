import { Controller, Query, Get } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficRequest } from './dto/traffic.dto';

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
