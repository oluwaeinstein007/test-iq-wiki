// import { Test, TestingModule } from '@nestjs/testing';
// import { HoldersController } from './holders.controller';

// describe('HoldersController', () => {
//   let controller: HoldersController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [HoldersController],
//     }).compile();

//     controller = module.get<HoldersController>(HoldersController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
import { Test, TestingModule } from '@nestjs/testing';
import { HoldersController } from './holders.controller';
import { HoldersService } from './holders.service';  // Import the service

describe('HoldersController', () => {
  let controller: HoldersController;
  let service: HoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldersController],
      providers: [
        {
          provide: HoldersService, // Provide a mock or real instance of HoldersService
          useValue: {
            // mock any methods you need from HoldersService here
            findAll: jest.fn().mockResolvedValue([]), // Example mock method
          },
        },
      ],
    }).compile();

    controller = module.get<HoldersController>(HoldersController);
    service = module.get<HoldersService>(HoldersService); // Optionally, get the service for assertions
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

