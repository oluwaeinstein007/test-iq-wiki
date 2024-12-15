// import { Test, TestingModule } from '@nestjs/testing';
// import { HoldersService } from './holders.service';

// describe('HoldersService', () => {
//   let service: HoldersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [HoldersService],
//     }).compile();

//     service = module.get<HoldersService>(HoldersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { HoldersService } from './holders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HoldersEntity } from './holders.entity';
import { Logger as LoggerEntity } from './logger.entity';

describe('HoldersService', () => {
  let service: HoldersService;
  let holdersRepositoryMock: any;
  let loggerRepositoryMock: any;

  beforeEach(async () => {
    // Mock the repository methods
    holdersRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };
    loggerRepositoryMock = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    // Set up the testing module with mocked repositories
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoldersService,
        {
          provide: getRepositoryToken(HoldersEntity),
          useValue: holdersRepositoryMock,
        },
        {
          provide: getRepositoryToken(LoggerEntity),
          useValue: loggerRepositoryMock,
        },
      ],
    }).compile();

    // Get the service instance
    service = module.get<HoldersService>(HoldersService);
  });

  //start check when I wake up
  // Test for fetching logs and saving balances successfully
  it('should fetch logs and save balances successfully', async () => {
    // Arrange: Mock the behavior of findOne, create, and external API calls
    loggerRepositoryMock.findOne.mockResolvedValue(null); // Simulate no logs found
    holdersRepositoryMock.create.mockReturnValue({}); // Mock create method to return an empty object
    holdersRepositoryMock.save.mockResolvedValue({}); // Mock save to resolve successfully
  
    // Mocking the external method or API call that might be causing the error
    service.getBlockByTimestamp = jest.fn().mockResolvedValue(1709785187); // Mocking successful block fetch
  
    // Mock any other necessary methods or services here
    
    // Act: Call the getLogs method with a mock holder address
    await service.getLogs('0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543');
  
    // Assert: Ensure save method was called, indicating balance was saved
    expect(holdersRepositoryMock.save).toHaveBeenCalled();
  });
  

  // Test for saving balances to the database
  it('should save balances to the database', async () => {
    // Arrange: Create a Map to pass as the single argument
    const holderAddress = '0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543';
    const balance = BigInt(1000); // balance needs to be a BigInt
  
    const balances = new Map<string, bigint>();
    balances.set(holderAddress, balance);
  
    // Mock the repository methods
    holdersRepositoryMock.findOne.mockResolvedValue(null); // Simulate no existing holder found
    holdersRepositoryMock.create.mockReturnValue({
      address: holderAddress,
      balance,
    });
    holdersRepositoryMock.save.mockResolvedValue({}); // Simulate successful save
  
    // Act: Call saveBalancesToDatabase with the Map
    await service.saveBalancesToDatabase(balances);
  
    // Assert: Ensure create and save were called with the correct data
    expect(holdersRepositoryMock.create).toHaveBeenCalledWith({
      address: holderAddress,
      balance,
    });
    expect(holdersRepositoryMock.save).toHaveBeenCalled();
  });

  // Test for handling errors during log fetching and balance saving
  it('should throw an error if fetching logs or saving balance fails', async () => {
    // Arrange: Mock findOne to throw an error
    loggerRepositoryMock.findOne.mockRejectedValue(new Error('Database Error'));

    // Act & Assert: Expect error to be thrown when calling getLogs
    await expect(
      service.getLogs('0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543'),
    ).rejects.toThrowError('Failed to fetch logs or save balances');
  });

  // Test for handling invalid repository methods
  it('should throw error if create method fails', async () => {
    // Arrange: Create a Map to pass as the single argument
    const holderAddress = '0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543';
    const balance = BigInt(1000); // balance needs to be a BigInt
  
    const balances = new Map<string, bigint>();
    balances.set(holderAddress, balance);
  
    // Mock the repository methods to simulate an error in the create method
    holdersRepositoryMock.findOne.mockResolvedValue(null); // Simulate no existing holder found
    holdersRepositoryMock.create.mockImplementation(() => {
      throw new Error('Invalid create method'); // Simulate error in create method
    });
  
    // Act & Assert: Call saveBalancesToDatabase and expect it to throw an error
    await expect(
      service.saveBalancesToDatabase(balances),
    ).rejects.toThrowError('Invalid create method');
  });

});


// import { Test, TestingModule } from '@nestjs/testing';
// import { HoldersService } from './holders.service';
// import { HoldersEntity } from './holders.entity';
// import { Logger as LoggerEntity } from './logger.entity';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { ethers } from 'ethers';

// jest.mock('ethers');

// // Define mocks for external dependencies
// const mockAddress = '0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543';
// const mockLogs = [
//   {
//     topics: ['Transfer(address,address,uint256)'],
//     data: '0x',
//   },
// ];
// const mockProvider = {
//   getLogs: jest.fn().mockResolvedValue(mockLogs),
//   getBlockNumber: jest.fn().mockResolvedValue(12345),
// };

// jest.spyOn(ethers, 'JsonRpcProvider').mockImplementation(() => mockProvider as any);

// // Test suite for HoldersService
// describe('HoldersService', () => {
//   let service: HoldersService;
//   let holdersRepository: Repository<HoldersEntity>;
//   let loggerRepository: Repository<LoggerEntity>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         HoldersService,
//         {
//           provide: getRepositoryToken(HoldersEntity),
//           useValue: {
//             findOne: jest.fn(),
//             save: jest.fn(),
//           },
//         },
//         {
//           provide: getRepositoryToken(LoggerEntity),
//           useValue: {
//             create: jest.fn(),
//             save: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<HoldersService>(HoldersService);
//     holdersRepository = module.get<Repository<HoldersEntity>>(getRepositoryToken(HoldersEntity));
//     loggerRepository = module.get<Repository<LoggerEntity>>(getRepositoryToken(LoggerEntity));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('getLogs', () => {
//     it('should fetch logs and save balances successfully', async () => {
//       // Mock private methods if needed
//       jest.spyOn(service as any, 'getBlockByTimestamp').mockResolvedValue(12345); // Mock private method
//       jest.spyOn(service as any, 'saveBalancesToDatabase').mockResolvedValue(undefined);

//       const result = await service.getLogs(mockAddress);

//       expect(result).toEqual({
//         message: 'Logs fetched, balances calculated, and saved successfully',
//       });
//       expect(mockProvider.getLogs).toHaveBeenCalled();
//       expect(service['getBlockByTimestamp']).toHaveBeenCalledTimes(2); // Access private method
//     });
//   });

//   describe('saveBalancesToDatabase', () => {
//     it('should save balances to the database', async () => {
//       const mockBalances = new Map([
//         ['0x123', BigInt(100)],
//         ['0x456', BigInt(200)],
//       ]);

//       jest.spyOn(holdersRepository, 'findOne').mockImplementation(async (criteria: any) => {
//         if (criteria.where?.address === '0x123') {
//           return { address: '0x123', balance: BigInt(50) } as HoldersEntity;
//         }
//         return null;
//       });

//       jest.spyOn(holdersRepository, 'save').mockImplementation(async (entity: HoldersEntity) => ({
//         ...entity,
//         id: entity.id || 1, // Ensure ID is present
//       } as HoldersEntity));

//       await service['saveBalancesToDatabase'](mockBalances);

//       expect(holdersRepository.findOne).toHaveBeenCalledWith({ where: { address: '0x123' } });
//       expect(holdersRepository.save).toHaveBeenCalledTimes(2);
//     });
//   });

//   describe('fetchLogsCronJob', () => {
//     it('should run the cron job successfully', async () => {
//       jest.spyOn(service, 'getLogs').mockResolvedValue({
//         message: 'Logs fetched, balances calculated, and saved successfully',
//       });

//       const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

//       await service.fetchLogsCronJob();

//       expect(service.getLogs).toHaveBeenCalledWith(mockAddress);
//       expect(consoleLogSpy).toHaveBeenCalledWith(
//         'Cron job completed: Logs fetched, balances calculated, and saved successfully',
//       );
//     });
//   });
// });
