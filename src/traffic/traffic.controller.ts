import {
  Controller,
  Query,
  Get,
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { getTrafficChacheKey } from '../const/cacheKeys';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Controller('fraffic')
export class TrafficController {
  constructor(
    private readonly trafficService: TrafficService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(':timestamp')
  async getTrafficImageByTimeStampAndPoint(
    @Param('timestamp', ParseIntPipe) _timestamp: number,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
  ) {
    const timestamp = Math.floor(_timestamp / 5000) * 5000; //Accuracy is 5 seconds

    const cacheKey = getTrafficChacheKey(timestamp, longitude, latitude);
    const cachedTraffic = await this.cacheManager.get(cacheKey);
    if (cachedTraffic) {
      return cachedTraffic;
    }
    return this.trafficService.getTrafficByTimeStampAndLocation(
      timestamp,
      longitude,
      latitude,
    );
  }
}
