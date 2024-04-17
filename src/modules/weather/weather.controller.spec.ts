import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { WeaterRequest, WeatherDto } from './dto/weather.dto';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;
  let cacheManager;

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [
        {
          provide: WeatherService,
          useValue: { getWeatherLocationsByDate: jest.fn() },
        },
        CacheModule,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should return cached weather data if available', async () => {
    const query: WeaterRequest = { date_time: '2024-04-10' };
    const cachedWeather = 'Cached Weather Data';
    cacheManager.get.mockResolvedValueOnce(cachedWeather);

    const result = await weatherController.getWeatherByDate(query);

    expect(result).toBe(cachedWeather);
    expect(cacheManager.get).toBeCalled();
  });

  it('should return weather data from service if cache is not available', async () => {
    const query: WeaterRequest = { date_time: '2024-04-10' };
    const weatherData: WeatherDto[] = [
      {
        name: 'Ang_Mo_Kio',
        point: {
          type: 'Point',
          coordinates: [103.839, 1.375],
        },
        date_time: '2024-04-08T12:24:00+08:00',
        valid_period_start: '2024-04-08T00:00:00+08:00',
        valid_period_end: '2024-04-08T02:00:00+08:00',
        forecast: 'Partly Cloudy (Day)',
      },
    ];
    cacheManager.get.mockResolvedValueOnce(null);
    jest
      .spyOn(weatherService, 'getWeatherLocationsByDate')
      .mockResolvedValueOnce(weatherData);

    const result = await weatherController.getWeatherByDate(query);

    expect(result).toBe(weatherData);
    expect(cacheManager.get).toBeCalled();
    expect(weatherService.getWeatherLocationsByDate).toBeCalledWith(
      query.date_time,
    );
  });
});
