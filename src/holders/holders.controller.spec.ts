import { Test, TestingModule } from '@nestjs/testing';
import { HoldersController } from './holders.controller';
import { HoldersService } from './holders.service';
import { NotFoundException } from '@nestjs/common';

describe('HoldersController', () => {
  let controller: HoldersController;
  let service: HoldersService;
  const TokenAddress: string = process.env.TOKEN_ADDRESS;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HoldersController],
      providers: [
        {
          provide: HoldersService,
          useValue: {
            getLogs: jest.fn(),
            getBalances: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HoldersController>(HoldersController);
    service = module.get<HoldersService>(HoldersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLogs', () => {
    it('should call getLogs and return the result', async () => {
      const address: string = TokenAddress;
      const logs = [{ address, balance: 1000n, id: 1 }];

      jest.spyOn(service, 'getLogs').mockResolvedValue(logs);

      const result = await controller.getLogs(address);

      expect(service.getLogs).toHaveBeenCalledWith(address); 
      expect(result).toEqual(logs); 
    });

    it('should handle errors and throw NotFoundException if logs are not found', async () => {
      const address = '0xInvalidAddress';

      jest.spyOn(service, 'getLogs').mockRejectedValue(new NotFoundException('Logs not found'));

      try {
        await controller.getLogs(address); 
      } catch (error) {
        expect(error.response.message).toBe('Logs not found');
        expect(error.status).toBe(404);
      }
    });
  });

  
  describe('getBalances', () => {
    it('should call getBalances and return the result', async () => {
      const address = TokenAddress;
      const balances = [{ address, balance: 1000n, id: 1 }];
  
      // Mock the service method
      jest.spyOn(service, 'getBalances').mockResolvedValue(balances);
  
      const result = await controller.getBalances(address, 1, 10);
  
      // Check that the service method was called with correct parameters
      expect(service.getBalances).toHaveBeenCalledWith(address, 1, 10);
  
      // Ensure the returned object has the correct structure
      expect(result).toEqual({
        message: 'Data fetched successfully',
        data: balances,
      });
    });
  
    it('should handle errors and throw NotFoundException if balances are not found', async () => {
      const address = '0xInvalidAddress';
  
      // Simulate an error from the service
      jest.spyOn(service, 'getBalances').mockRejectedValue(new NotFoundException('Balances not found'));
  
      try {
        await controller.getBalances(address, 1, 10);
      } catch (error) {
        // Ensure the error is correctly thrown and handled
        expect(error.response.message).toBe('Balances not found');
        expect(error.status).toBe(404);
      }
    });
  });
  
});
