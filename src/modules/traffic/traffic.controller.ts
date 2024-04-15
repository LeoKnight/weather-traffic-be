import { Controller, Query, Get, Inject } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { getTrafficChacheKey } from '../../constants/cacheKeys';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { TrafficRequest } from './dto/traffic.dto';

@Controller('api/traffic')
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  async getTrafficImageByTimeStampAndPoint(@Query() query: TrafficRequest) {
    // const timestamp = Math.floor(_timestamp / 5000) * 5000; //Accuracy is 5 seconds
    const { date_time, longitude, latitude } = query;
    const cacheKey = getTrafficChacheKey(date_time, longitude, latitude);
    const cachedTraffic = await this.cacheManager.get(cacheKey);
    if (cachedTraffic) {
      return cachedTraffic;
    }
    return await this.trafficService.getTrafficByDateAndLocation(
      date_time,
      longitude,
      latitude,
    );
  }
}
