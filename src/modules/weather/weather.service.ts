import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeatherDto } from './dto/weather.dto';
import { Weather } from './entities/weather.entity';
import { timestampToDateTime } from '../../utils/converter';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getWeatherChacheKey } from '../../constants/cacheKeys';

// {
//   "name": "Ang Mo Kio",
//   "label_location": {
//       "latitude": 1.375,
//       "longitude": 103.839
//   }
// },

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

  async getWeatherLocationsByDate(
    date_time: string,
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

  // this.weatherRepository
  //       .createQueryBuilder()
  //       .insert()
  //       .into(Weather)
  //       .values(weatherDtoList)
  //       .execute();
}
