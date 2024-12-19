import { Test, TestingModule } from '@nestjs/testing';
import { HoldersService } from './holders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HoldersEntity } from './entities/holders.entity';
import { Logger as LoggerEntity } from './entities/logger.entity';
import { BalanceUtil } from './utils/balance.utils';
import { BlockByTimestamp } from './utils/block.utils';
import { processLogs } from './utils/processlog.utils';
import { ConfigModule, ConfigService } from '@nestjs/config';

jest.mock('./utils/processlog.utils');
describe('HoldersService', () => {
  let service: HoldersService;
  let holdersRepositoryMock: any;
  let loggerRepositoryMock: any;
  let balanceUtilMock: any;
  const TokenAddress: string = process.env.TOKEN_ADDRESS;
  const TimeStamp = 1709785187;

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
      create: jest.fn(),
    };

    // Mock the BalanceUtil methods
    balanceUtilMock = {
      saveBalancesToDatabase: jest.fn(),
    };

    // Mock the BlockByTimestamp dependency
    const blockByTimestampMock = {
      getBlockByTimestamp: jest.fn(),
    };

    

    // Mock the ConfigService to return the TokenAddress
    const configServiceMock = {
      get: jest.fn().mockReturnValue(TokenAddress),
    };

    // Set up the testing module with mocked repositories, BalanceUtil, and ConfigModule
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
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
        {
          provide: BalanceUtil,
          useValue: balanceUtilMock,
        },
        {
          provide: BlockByTimestamp,
          useValue: blockByTimestampMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    // Get the service instance
    service = module.get<HoldersService>(HoldersService);
  });
  

  it('should throw an error if getLogs fails', async () => {
    // Arrange
    const error = new Error('Fetch error');
    (processLogs as jest.Mock).mockImplementation(() => {
      throw error;
    });

    // Act & Assert
    await expect(service.getLogs()).rejects.toThrow('Failed to fetch logs or save balances');
  });


  it('should save logger entry if not already existing', async () => {
    // Arrange
    // Mocking loggerRepositoryMock methods
    loggerRepositoryMock.findOne.mockResolvedValue(null);
    const loggerEntry = { timestamp: TimeStamp, blockNumber: 6789 };
  
    // Mock create and save methods
    loggerRepositoryMock.create.mockReturnValue(loggerEntry);
    loggerRepositoryMock.save.mockResolvedValue(loggerEntry);
  
    // Act
    await service['saveLoggerEntry'](TimeStamp, 6789);
  
    // Assert
    expect(loggerRepositoryMock.create).toHaveBeenCalledWith(loggerEntry);
    expect(loggerRepositoryMock.save).toHaveBeenCalledWith(loggerEntry);
  });

  
  it('should skip saving logger entry if it already exists', async () => {
    // Arrange
    const existingLogger = { timestamp: TimeStamp, blockNumber: 6789 };
    loggerRepositoryMock.findOne.mockResolvedValue(existingLogger);

    // Act
    await service['saveLoggerEntry'](TimeStamp, 6789);

    // Assert
    expect(loggerRepositoryMock.create).not.toHaveBeenCalled();
    expect(loggerRepositoryMock.save).not.toHaveBeenCalled();
  });


  it('should paginate balances correctly', async () => {
    // Arrange
    const paginatedResults = [{ address: '0x123', balance: BigInt(1000) }];
    holdersRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(paginatedResults),
    });

    // Act
    const results = await service.getBalances(undefined, 1, 10);

    // Assert
    expect(results).toEqual(paginatedResults);
  });

});
