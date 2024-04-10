import {
  Controller,
  //   Delete,
  Get,
  Param,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getWeatherChacheKey } from '../const/cacheKeys';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(':timestamp')
  async getWeatherByTimeStamp(
    @Param('timestamp', ParseIntPipe) _timestamp: number,
  ) {
    const timestamp = Math.floor(_timestamp / 5000) * 5000; //Accuracy is 5 seconds
    const cacheKey = await getWeatherChacheKey(timestamp);
    const cachedWeather = await this.cacheManager.get(cacheKey);
    if (cachedWeather) {
      return cachedWeather;
    } else {
      return this.weatherService.getWeatherLocationsByTimeStamp(timestamp);
    }
  }
}
