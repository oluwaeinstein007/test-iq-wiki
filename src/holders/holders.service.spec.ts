import { Test, TestingModule } from '@nestjs/testing';
import { HoldersService } from './holders.service';

describe('HoldersService', () => {
  let service: HoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HoldersService],
    }).compile();

    service = module.get<HoldersService>(HoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
