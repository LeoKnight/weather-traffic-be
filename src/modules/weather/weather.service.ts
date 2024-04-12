import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeatherDto, IValidPeriod, IForecast } from './dto/weather.dto';
import { Weather } from './entities/weather.entity';
import { timestampToDateTime } from '../../utils/converter';
import axios from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getWeatherChacheKey } from '../../constants/cacheKeys';

const weatherForecastAPI =
  'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

// {
//   "name": "Ang Mo Kio",
//   "label_location": {
//       "latitude": 1.375,
//       "longitude": 103.839
//   }
// },
interface IAreaMetadata {
  name: string;
  label_location: {
    latitude: number;
    longitude: number;
  };
}

// {
//   timestamp: "2024-04-08T17:39:37+08:00",
//   image:
//     "https://images.data.gov.sg/api/traffic-images/2024/04/7078791f-93ea-45f6-98a7-9f7bb2c99b43.jpg",
//   location: {
//     latitude: 1.323957439,
//     longitude: 103.8728576,
//   },
//   camera_id: "1003",
//   image_metadata: {
//     height: 240,
//     width: 320,
//     md5: "999d9a9d30600a81847c2e45cc0bdc43",
//   },
// };

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getWeatherLocationsByTimeStamp(
    timestamp: number,
  ): Promise<CreateWeatherDto[]> {
    try {
      const weatherDtoList: CreateWeatherDto[] =
        await this.fetchWeatherByTimeStamp(timestamp);
      this.cacheManager.set(getWeatherChacheKey(timestamp), weatherDtoList);

      return weatherDtoList;
    } catch (error) {
      // error handling
      console.error('Error fetching data from external API:', error);
      throw error;
    }
  }

  async fetchWeatherByTimeStamp(
    timestamp: number,
  ): Promise<CreateWeatherDto[]> {
    const dateTime = timestampToDateTime(timestamp);

    try {
      const params = {
        date_time: dateTime,
      };
      const weatherRes = await axios.get(weatherForecastAPI, {
        params,
      });

      const areaMetadata: IAreaMetadata[] = weatherRes.data.area_metadata;
      const validPeriod: IValidPeriod = weatherRes.data.items[0].valid_period;
      const forecasts: IForecast[] = weatherRes.data.items[0].forecasts;

      const weatherDtoList: CreateWeatherDto[] = areaMetadata.map((area) => {
        return {
          name: area.name.replaceAll(' ', '_'),
          point: {
            type: 'Point',
            coordinates: [
              area.label_location.longitude,
              area.label_location.latitude,
            ],
          },
          timestamp,
          date_time_with_timezone: dateTime,
          valid_period_start: validPeriod.start,
          valid_period_end: validPeriod.end,
          forecast: forecasts.find((e) => e.area === area.name)?.forecast,
        };
      });
      this.weatherRepository
        .createQueryBuilder()
        .insert()
        .into(Weather)
        .values(weatherDtoList)
        .execute();

      return weatherDtoList;
    } catch (error) {
      // error handling
      console.error('Error fetching data from external API:', error);
      throw error;
    }
  }
}
