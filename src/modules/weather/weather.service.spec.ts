// FILEPATH: /Users/leoknight/Desktop/weather-traffic-be/src/modules/weather/weather.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Weather } from './entities/weather.entity';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ExternalApiService } from '../external-api/external-api.service';
import { Repository } from 'typeorm';

describe('WeatherService', () => {
  let service: WeatherService;
  let mockRepository: Partial<Record<keyof Repository<Weather>, jest.Mock>>;
  let mockCacheManager: { set: jest.Mock; get: jest.Mock };
  let mockExternalApiService: { fetchWeatherByDate: jest.Mock };

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
    };
    mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
    };
    mockExternalApiService = {
      fetchWeatherByDate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(Weather),
          useValue: mockRepository,
        },
        CacheModule,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: ExternalApiService,
          useValue: mockExternalApiService,
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should return weather data from repository if available', async () => {
    const date_time = '2024-04-10';
    const weatherData = [
      {
        name: 'Ang_Mo_Kio',
        point: { type: 'Point', coordinates: [103.839, 1.375] },
        date_time: '2024-04-08T12:24:00+08:00',
        valid_period_start: '2024-04-08T00:00:00+08:00',
        valid_period_end: '2024-04-08T02:00:00+08:00',
        forecast: 'Partly Cloudy (Day)',
      },
    ];
    mockRepository.find.mockResolvedValueOnce(weatherData);

    const result = await service.getWeatherLocationsByDate(date_time);

    expect(result).toBe(weatherData);
    expect(mockRepository.find).toBeCalledWith({
      where: {
        date_time: new Date(date_time),
      },
    });
  });

  it('should return weather data from external service if not available in repository', async () => {
    const date_time = '2024-04-10';
    const weatherData = [
      {
        name: 'Ang_Mo_Kio',
        point: { type: 'Point', coordinates: [103.839, 1.375] },
        date_time: '2024-04-08T12:24:00+08:00',
        valid_period_start: '2024-04-08T00:00:00+08:00',
        valid_period_end: '2024-04-08T02:00:00+08:00',
        forecast: 'Partly Cloudy (Day)',
      },
    ];
    mockRepository.find.mockResolvedValueOnce([]);
    mockExternalApiService.fetchWeatherByDate.mockResolvedValueOnce(
      weatherData,
    );

    const result = await service.getWeatherLocationsByDate(date_time);

    expect(result).toBe(weatherData);
    expect(mockRepository.find).toBeCalledWith({
      where: {
        date_time: new Date(date_time),
      },
    });
    expect(mockExternalApiService.fetchWeatherByDate).toBeCalledWith(date_time);
    expect(mockCacheManager.set).toBeCalledWith(
      expect.any(String),
      weatherData,
    );
  });
});
