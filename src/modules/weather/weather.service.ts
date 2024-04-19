import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherDto } from './dto/weather.dto';
import { Weather } from './entities/weather.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getWeatherChacheKey } from 'src/constants/cacheKeys';
import { ExternalApiService } from 'src/modules/external-api/external-api.service';
// import { SearchRecordService } from '../searchRecord/searchRecord.service';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
    // @Inject(SearchRecordService)
    // private readonly searchRecordService: SearchRecordService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly externalApiService: ExternalApiService,
  ) {}

  async getWeatherLocationsByDate(date_time: string): Promise<WeatherDto[]> {
    try {
      // check if data is in repository

      const weatherData = await this.getDataFromRepository(date_time);
      if (weatherData.length > 0) {
        return weatherData;
      }
      const weatherDtoList: WeatherDto[] =
        await this.externalApiService.fetchWeatherByDate(date_time);
      this.cacheManager.set(getWeatherChacheKey(date_time), weatherDtoList);

      return weatherDtoList;
    } catch (error) {
      // error handling
      console.error('Error fetching data from external API:', error);
      throw error;
    }
  }

  async getDataFromRepository(date_time: string): Promise<WeatherDto[]> {
    const result: Weather[] = await this.weatherRepository.find({
      where: {
        date_time: new Date(date_time),
      },
    });
    // entity to dto
    const convertToDto: WeatherDto[] = result.map((weather) => {
      return {
        name: weather.name,
        point: weather.point,
        date_time: weather.date_time.toUTCString(),
        valid_period_start: weather.valid_period_start.toUTCString(),
        valid_period_end: weather.valid_period_end.toUTCString(),
        forecast: weather.forecast,
      };
    });
    return convertToDto;
  }

  async saveDataToRepository(weatherDtoList: WeatherDto[]): Promise<void> {
    await this.weatherRepository
      .createQueryBuilder()
      .insert()
      .into(Weather)
      .values(weatherDtoList)
      .execute();
  }
}
