import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [WeatherService, { provide: CACHE_MANAGER, useValue: {} }],
    }).compile();

    weatherController = app.get<WeatherController>(WeatherController);
    weatherService = app.get<WeatherService>(WeatherService);
    cacheManager = app.get<Cache>(CACHE_MANAGER);
  });

  describe('getWeatherByTimeStamp', () => {
    it('should return cached weather data if available', async () => {
      const timestamp = 1620000000000;
      const cachedWeather = { data: 'cached weather data' };
      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedWeather);

      expect(await weatherController.getWeatherByTimeStamp(timestamp)).toBe(
        cachedWeather,
      );
    });
});
