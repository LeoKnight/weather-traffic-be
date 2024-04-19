import { TestingModule, Test } from '@nestjs/testing';
import { ExternalApiService } from './external-api.service';
import { HttpService } from '@nestjs/axios';

describe('ExternalApiService', () => {
  let service: ExternalApiService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalApiService,
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<ExternalApiService>(ExternalApiService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
