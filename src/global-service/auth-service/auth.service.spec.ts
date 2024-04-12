import { Test, TestingModule } from '@nestjs/testing';
import { AutheService } from './auth.service';

describe('GlobalServiceService', () => {
  let service: AutheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutheService],
    }).compile();

    service = module.get<AutheService>(AutheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
