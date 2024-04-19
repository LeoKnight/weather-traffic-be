import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestingModule, Test } from '@nestjs/testing';
import { TrafficRequest } from './dto/traffic.dto';
import { TrafficController } from './traffic.controller';
import { TrafficService } from './traffic.service';

describe('TrafficController', () => {
  let trafficController: TrafficController;
  let trafficService: TrafficService;
  let cacheManager;

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficController],
      providers: [
        {
          provide: TrafficService,
          useValue: { getTrafficByDateAndLocation: jest.fn() },
        },
        CacheModule,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
      ],
    }).compile();

    trafficController = module.get<TrafficController>(TrafficController);
    trafficService = module.get<TrafficService>(TrafficService);
  });

  it('getTrafficImageByTimeStampAndPoint', async () => {
    const query: TrafficRequest = {
      date_time: '2024-04-10',
      latitude: 1.375,
      longitude: 103.839,
      location: 'Ang_Mo_Kio',
    };

    await trafficController.getTrafficImageByTimeStampAndPoint(query);

    expect(trafficService.getTrafficByDateAndLocation).toHaveBeenCalled();
  });
});
