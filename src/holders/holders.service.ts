import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { HoldersEntity } from './holders.entity';
import { Logger as LoggerEntity } from './logger.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { decodeEventLog } from 'viem';
// import * as contractABI from './contractABI.json';
import contractABI from './contractABI.json';

import { ethers, Interface, Log } from 'ethers';

import { Cron, CronExpression } from '@nestjs/schedule';


// import * as contractABI from './contractABI.json';

@Injectable()
export class HoldersService {
    private readonly API_BASE_URL = process.env.BaseURL || 'https://api-holesky.fraxscan.com/api';
    private readonly API_KEY = process.env.FraxApiKey;

    constructor(
        @InjectRepository(HoldersEntity)
        private holdersRepository: Repository<HoldersEntity>,
        @InjectRepository(LoggerEntity)
        private loggerRepository: Repository<LoggerEntity>,
      ) {}

      


  async getLogs(address: string): Promise<any> {
    try {
      // Initialize ethers provider
      const provider = new ethers.JsonRpcProvider(process.env.BaseURL);
  
      // Inject the Logger repository
      const loggerRepo = this.loggerRepository;
  
      // Define constants for timestamp increments
      const secondsIn25Days = 25 * 24 * 60 * 60;
      let currentTimestamp = 1709785187; // Starting timestamp
      let currentBlock: number | undefined;
      // console.log('im fine1');
      // Check for the last saved logger entry
      const lastLogger = await loggerRepo.findOne({
        where: {},
        order: { timestamp: 'DESC' },
      });
      // console.log('im fine2');
  
      if (lastLogger) {
        console.log('Resuming from the last saved timestamp and block');
        currentTimestamp = lastLogger.timestamp;
        currentBlock = lastLogger.blockNumber;
        // console.log('im fine3');
      }
  
      while (true) {
        // Get the starting block using the current timestamp
        const fromBlock = await this.getBlockByTimestamp(currentTimestamp);
        if (!fromBlock) throw new Error('Failed to fetch the starting block.');
  
        // Calculate the next timestamp (25 days later) and get the corresponding block
        const nextTimestamp = currentTimestamp + secondsIn25Days;
  
        // Check if nextTimestamp is in the future
        const currentTime = Math.floor(Date.now() / 1000); // Current timestamp
        const toBlock = nextTimestamp > currentTime
          ? 'latest' // If the next timestamp is in the future, use 'latest'
          : await this.getBlockByTimestamp(nextTimestamp); // Else, fetch the block by timestamp
  
        if (toBlock === 'latest' || !toBlock) {
          // Use 'latest' if the block couldn't be fetched for the future timestamp
          console.log('Using latest block due to future timestamp');
        } else if (!toBlock) {
          throw new Error('Failed to fetch the ending block.');
        }
  
        // Set up the filter for fetching logs
        const filter = {
          address,
          fromBlock,
          toBlock,
        };
  
        // Fetch logs
        console.log(`Fetching logs from block ${fromBlock} to ${toBlock}`);
        const logs: Log[] = await provider.getLogs(filter);
        const iface = new Interface(contractABI);
  
        // Map to store balances
        const balances: Map<string, bigint> = new Map();
  
        // Process logs
        logs.forEach((log: Log) => {
          try {
            const decoded = iface.parseLog({
              topics: log.topics,
              data: log.data,
            });
  
            const { name: event, args } = decoded;
  
            if (event === 'Transfer') {
              const from = args[0];
              const to = args[1];
              const amount = BigInt(args[2]);
  
              // Deduct balance from 'from' address
              if (from !== ethers.ZeroAddress) {
                balances.set(from, (balances.get(from) || BigInt(0)) - amount);
              }
  
              // Add balance to 'to' address
              balances.set(to, (balances.get(to) || BigInt(0)) + amount);
            } else if (event === 'Mint') {
              const to = args[0];
              const amount = BigInt(args[1]);
  
              // Add balance to 'to' address
              balances.set(to, (balances.get(to) || BigInt(0)) + amount);
            }
          } catch (error) {
            console.error('Error decoding log:', error);
          }
        });
        
        // Save balances to the database
        await this.saveBalancesToDatabase(balances);
  
        // Save the timestamp and block number for future runs
        const existingLogger = await this.loggerRepository.findOne({ where: { timestamp: currentTimestamp } });
        if (!existingLogger) {
          const newLogger = this.loggerRepository.create({
            timestamp: currentTimestamp,
            blockNumber: fromBlock, // Use the current fromBlock as the block number
          });
          await this.loggerRepository.save(newLogger);
        } else {
          console.log('Logger entry with this timestamp already exists, skipping save.');
        }
  
        // Update timestamp for the next iteration
        currentTimestamp = nextTimestamp;
  
        // Exit the loop if we've reached the latest block
        const latestBlock = await provider.getBlockNumber();
        if (toBlock === 'latest' || toBlock >= latestBlock) break;
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
  

  // Function to get a block number by timestamp
  public async getBlockByTimestamp(timestamp: number): Promise<number | undefined> {
    try {
      const apiKey = process.env.FraxApiKey;

      const url = `https://api.fraxscan.com/api`;
      const params = {
        module: 'block',
        action: 'getblocknobytime',
        timestamp,
        closest: 'before',
        apikey: apiKey,
      };

      // Make the API request
      const response = await axios.get(url, { params });

      // Return the block number
      if (response.data && response.data.status === '1') {
        return parseInt(response.data.result, 10);
      } else {
        console.error('Error fetching block by timestamp:', response.data.message || 'Unknown error occurred');
        return undefined;
      }
    } catch (error) {
      console.error('Error fetching block by timestamp:', error);
      return undefined;
    }
  }

  // Save balances to the database
  public async saveBalancesToDatabase(balances: Map<string, bigint>) {
    for (const [holderAddress, balance] of balances.entries()) {
      const existingHolder = await this.holdersRepository.findOne({
        where: { address: holderAddress },
      });
  
      if (existingHolder) {
        existingHolder.balance = BigInt(existingHolder.balance) + balance; 
        await this.holdersRepository.save(existingHolder);
      } else {
        const newHolder = this.holdersRepository.create({
          address: holderAddress,
          balance,
        });
        await this.holdersRepository.save(newHolder);
      }
    }
  }

  


  // @Cron(CronExpression.EVERY_5_MINUTES) I changed to 6 hours to avoid too many requests
  // @Cron('0 */6 * * *')
  // async fetchLogsCronJob() {
  //   // console.log('Cron job started: Fetching logs every 5 minutes');
  //   console.log('Cron job started: Fetching logs every 6 hours');

  //   const address = '0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543';

  //   try {
  //     const result = await this.getLogs(address);
  //     console.log(`Cron job completed: ${result.message}`);
  //   } catch (error) {
  //     console.error('Cron job failed:', error.message);
  //   }
  // }
  @Cron('0 */6 * * *')
  async fetchLogsCronJob() {
    // Delay the cron job execution by 5 minutes
    setTimeout(async () => {
      console.log('Cron job started: Fetching logs every 6 hours');
      const address = '0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543';
      try {
        const result = await this.getLogs(address);
        console.log(`Cron job completed: ${result.message}`);
      } catch (error) {
        console.error('Cron job failed:', error.message);
      }
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
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
