import { Injectable } from '@nestjs/common';
import { HoldersEntity } from './entities/holders.entity';
import { Logger as LoggerEntity } from './entities/logger.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ethers, Log } from 'ethers';

import { BlockByTimestamp } from './utils/block.utils';
import { BalanceUtil } from './utils/balance.utils';
import { processLogs } from './utils/processlog.utils';
import { ConfigService } from '@nestjs/config';
import { delay } from './utils/delay.utils';

@Injectable()
export class HoldersService {
    private readonly secondsIn25Days = 25 * 24 * 60 * 60;
    private currentTimestamp = 1709785187;
    private TokenAddress: string;
    private BaseURL: string;

    constructor(
        private readonly balanceUtil: BalanceUtil,
        private readonly blockByTimestamp: BlockByTimestamp,
        private configService: ConfigService,
        @InjectRepository(HoldersEntity)
        private holdersRepository: Repository<HoldersEntity>,
        @InjectRepository(LoggerEntity)
        private loggerRepository: Repository<LoggerEntity>,
      ) {
        this.TokenAddress = this.configService.get('TokenAddress');
        this.BaseURL = this.configService.get('BaseURL');
      }

      


  async getLogs(address: string = this.TokenAddress): Promise<any> {
    try {
      console.log('address: ' + address);
      const provider = new ethers.JsonRpcProvider(this.BaseURL);
      const loggerRepo = this.loggerRepository;
  
      let currentTimestamp = this.currentTimestamp;
      let currentBlock: number | undefined;
      
      // Check for the last saved logger entry
      const lastLogger = await loggerRepo.findOne({
        where: {},
        order: { timestamp: 'DESC' },
      });
  
      if (lastLogger) {
        console.log('Resuming from the last saved timestamp and block');
        currentTimestamp = lastLogger.timestamp;
        currentBlock = lastLogger.blockNumber;
      }
  
      while (true) {
        const fromBlock = await this.blockByTimestamp.getBlockByTimestamp(currentTimestamp);
        if (!fromBlock) throw new Error('Failed to fetch the starting block.');

        const nextTimestamp = currentTimestamp + this.secondsIn25Days;
  
        // Check if nextTimestamp is in the future
        const currentTime = Math.floor(Date.now() / 1000);
        const toBlock = nextTimestamp > currentTime
          ? 'latest'
          : await this.blockByTimestamp.getBlockByTimestamp(nextTimestamp);
  
        if (toBlock === 'latest' || !toBlock) {
          console.log('Using latest block due to future timestamp');
        } else if (!toBlock) {
          throw new Error('Failed to fetch the ending block.');
        }

        console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);
        const logs: Log[] = await provider.getLogs({ address, fromBlock, toBlock });
        const balances = processLogs(logs);
        
        await this.balanceUtil.saveBalancesToDatabase(balances);
        await this.saveLoggerEntry(currentTimestamp, fromBlock);

        currentTimestamp = nextTimestamp;
  
        const latestBlock = await provider.getBlockNumber();
        if (toBlock === 'latest' || toBlock >= latestBlock) break;

        await delay(200);
      }

      console.log('Logs fetched, balances calculated, and saved successfully');
      return {
        message: 'Logs fetched, balances calculated, and saved successfully',
      };
    } catch (error) {
      console.error('Error fetching logs or saving balance:', error);
      throw new Error('Failed to fetch logs or save balances');
    }
  }
  

  // Save the timestamp and block number for future runs
  public async saveLoggerEntry(timestamp: number, blockNumber: number): Promise<void> {
    const existingLogger = await this.loggerRepository.findOne({ where: { timestamp } });
    if (!existingLogger) {
      const newLogger = this.loggerRepository.create({ timestamp, blockNumber });
      await this.loggerRepository.save(newLogger);
    } else {
      console.log(`Logger entry for timestamp ${timestamp} already exists.`);
    }
  }


async getBalances(address?: string, page: number = 1, limit: number = 10): Promise<HoldersEntity[]> {
  // Define query with optional address condition
  const query = this.holdersRepository.createQueryBuilder('holders');
  
  if (address) {
      query.where('holders.address = :address', { address });
  }

  // Calculate pagination offsets
  const startIndex = (page - 1) * limit;

  // Fetch paginated data directly
  const data = await query
      .skip(startIndex)
      .take(limit)
      .getMany();

  return data;

}







}