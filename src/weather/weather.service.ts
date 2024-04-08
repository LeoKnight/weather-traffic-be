import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrafficDto, CreateWeatherDto } from './dto/weather.dto';
import { Traffic } from './entities/traffic.entity';
import { Weather } from './entities/weather.entity';
import { timestampToDateTime } from '../utils/converter';
import axios from 'axios';

const weatherForecastAPI =
  'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
const trafficImagesAPI = 'https://api.data.gov.sg/v1/transport/traffic-images';

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
interface ITrafficItem {
  timestamp: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  camera_id: string;
  image_metadata: {
    height: number;
    width: number;
    md5: string;
  };
}

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Traffic)
    private readonly trafficRepository: Repository<Traffic>,
    @InjectRepository(Weather)
    private readonly weatherRepository: Repository<Weather>,
  ) {}

  createWeather(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    const weather = new Weather();
    weather.name = createWeatherDto.name;
    return this.weatherRepository.save(weather);
  }

  async getWeatherByTimeStamp(timestamp: number): Promise<any> {
    const dateTime = timestampToDateTime(timestamp);

    try {
      const params = {
        date_time: dateTime,
      };
      const weatherRes = await axios.get(weatherForecastAPI, {
        params,
      });
      const areaMetadata: IAreaMetadata[] = weatherRes.data.area_metadata;
      const weatherDtoList: CreateWeatherDto[] = areaMetadata.map((area) => {
        return {
          name: area.name,
          latitude: area.label_location.latitude,
          longitude: area.label_location.longitude,
          timestamp: dateTime, // convert timestamp to datetime
        };
      });
      this.weatherRepository
        .createQueryBuilder()
        .insert()
        .into(Weather)
        .values(weatherDtoList)
        .execute();
      const trafficRes = await axios.get(trafficImagesAPI, {
        params,
      });
      const trafficList: ITrafficItem[] = trafficRes.data;
      const trafficDtoList: CreateTrafficDto[] = trafficList.map((traffic) => {
        return {
          image_url: traffic.image,
          latitude: traffic.location.latitude,
          longitude: traffic.location.longitude,
          timestamp: traffic.timestamp, // convert timestamp to datetime
        };
      });

      this.trafficRepository
        .createQueryBuilder()
        .insert()
        .into(Traffic)
        .values(trafficDtoList)
        .execute();

      // this.weatherRepository

      return {
        locationList: weatherDtoList.map((e) => e.name),
        // trafficRes: trafficRes.data,
      };
    } catch (error) {
      // error handling
      console.error('Error fetching data from external API:', error);
      throw error;
    }
  }

  //   async findAll(): Promise<User[]> {
  //     return this.usersRepository.find();
  //   }

  //   findOne(id: number): Promise<User> {
  //     return this.usersRepository.findOneBy({ id: id });
  //   }

  //   async remove(id: string): Promise<void> {
  //     await this.usersRepository.delete(id);
  //   }
}
