// FILEPATH: /Users/leoknight/Desktop/weather-traffic-be/src/modules/weather/weather.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { ExternalApiService } from '../external-api/external-api.service';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockRepository: jest.Mocked<Repository<Weather>>;
  let mockExternalApiService: jest.Mocked<ExternalApiService>;
  const weatherRepositoryToken = getRepositoryToken(Weather);

  const mockWeatherAPIResponse: any = {
    area_metadata: [
      {
        name: 'Ang Mo Kio',
        label_location: {
          latitude: 1.375,
          longitude: 103.839,
        },
      },
    ],
    items: [
      {
        forecasts: [
          {
            area: 'Ang Mo Kio',
            forecast: 'Partly Cloudy (Day)',
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: weatherRepositoryToken,
          useFactory: () => ({
            create: jest.fn(() => {}),
            insert: jest.fn(() => {}),
            find: jest.fn(() => []),
          }),
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(() => {}),
          },
        },
        {
          provide: ExternalApiService,
          useFactory: () => ({
            fetchWeatherByDate: jest.fn(() => {}),
            fetchTrafficByDate: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);

    mockRepository = module.get<Repository<Weather>>(
      weatherRepositoryToken,
    ) as jest.Mocked<Repository<Weather>>;

    mockExternalApiService = module.get<ExternalApiService>(
      ExternalApiService,
    ) as jest.Mocked<ExternalApiService>;
  });

  it('Weather repository should be defined', () => {
    expect(mockRepository).toBeDefined();
  });

  it('should call external api when no data in repository', async () => {
    const date_time = '2024-04-08T12:24:00+08:00';
    mockExternalApiService.fetchWeatherByDate.mockResolvedValueOnce(
      Promise.resolve(mockWeatherAPIResponse),
    );
    const result = await service.getWeatherLocationsByDate(date_time);
    expect(result).toMatchObject({
      area_metadata: [
        {
          label_location: { latitude: 1.375, longitude: 103.839 },
          name: 'Ang Mo Kio',
        },
      ],
      items: [
        {
          forecasts: [{ area: 'Ang Mo Kio', forecast: 'Partly Cloudy (Day)' }],
        },
      ],
    });
  });
});
