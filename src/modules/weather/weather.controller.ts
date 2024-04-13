import { Controller, UseFilters, Get, Inject, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'src/filters/global.exception/global.exception.filter';

import { WeatherService } from './weather.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getWeatherChacheKey } from '../../constants/cacheKeys';
import { WeaterRequest } from './dto/weather.dto';

@ApiTags('Weather')
@Controller('api/weather')
@UseFilters(new GlobalExceptionFilter())
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @ApiResponse({
    status: 201,
    description: 'Weather Forcast API',
    type: String,
  })
  async getWeatherByDate(@Query() query: WeaterRequest) {
    const { date_time } = query;
    const cacheKey = await getWeatherChacheKey(date_time);
    const cachedWeather = await this.cacheManager.get(cacheKey);
    if (cachedWeather) {
      return cachedWeather;
    } else {
      return this.weatherService.getWeatherLocationsByDate(date_time);
    }
  }
}
