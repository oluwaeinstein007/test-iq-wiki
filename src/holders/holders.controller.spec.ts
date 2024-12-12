import { Test, TestingModule } from '@nestjs/testing';
import { HoldersController } from './holders.controller';

describe('HoldersController', () => {
  let controller: HoldersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldersController],
    }).compile();

    controller = module.get<HoldersController>(HoldersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
