import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateWeatherDto } from 'src/modules/weather/dto/weather.dto';
import { trafficImagesAPI, weatherForecastAPI } from 'src/constants';
import { IAreaMetadata } from 'src/type';
import {
  IValidPeriod,
  IWeatherDataResponse,
  IForecasts,
} from 'src/type/weather';
import { firstValueFrom } from 'rxjs';
import { CreateTrafficDto } from 'src/modules/traffic/dto/traffic.dto';
import { ITrafficImagesItems, ITrafficImagesResponse } from '../type/traffice';

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);
  constructor(private readonly httpService: HttpService) {}

  async fetchWeatherByDate(dateTime: string): Promise<CreateWeatherDto[]> {
    try {
      const params = {
        date_time: dateTime,
      };
      const { data } = await firstValueFrom(
        this.httpService.get<IWeatherDataResponse>(weatherForecastAPI, {
          params,
        }),
      );

      const areaMetadata: IAreaMetadata[] = data.area_metadata;
      const validPeriod: IValidPeriod = data.items[0].valid_period;
      const forecasts: IForecasts[] = data.items[0].forecasts;
      const timestamp: string = data.items[0].timestamp;

      const weatherDtoList: CreateWeatherDto[] = areaMetadata.map((area) => {
        const forecast = forecasts.find((e) => e.area === area.name)?.forecast;
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
          forecast,
        };
      });

      return weatherDtoList;
    } catch (error) {
      // error handling
      Logger.error(error);
      throw new ServiceUnavailableException(
        'Error fetching data from external API:',
        error,
      );
    }
  }

  async fetchTrafficByDate(dateTime: string): Promise<CreateTrafficDto[]> {
    try {
      const params = {
        date_time: dateTime,
      };

      const { data } = await firstValueFrom(
        this.httpService.get<ITrafficImagesResponse>(trafficImagesAPI, {
          params,
        }),
      );

      const trafficList: ITrafficImagesItems[] = data.items[0].cameras;
      const trafficDtoList: CreateTrafficDto[] = trafficList.map((traffic) => {
        return {
          image_url: traffic.image,
          point: {
            type: 'Point',
            coordinates: [
              traffic.location.longitude,
              traffic.location.latitude,
            ],
          },
          width: traffic.image_metadata.width,
          height: traffic.image_metadata.height,
          date_time: new Date(dateTime),
        };
      });

      return trafficDtoList;
    } catch (error) {
      // error handling
      Logger.error(error);
      throw new ServiceUnavailableException(
        'Error fetching data from external API:',
        error,
      );
    }
  }
}
