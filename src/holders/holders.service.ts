import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { HoldersEntity } from './holders.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class HoldersService {
    private readonly API_BASE_URL = process.env.BaseURL || 'https://api-holesky.fraxscan.com/api';
    private readonly API_KEY = process.env.FraxApiKey;

    constructor(
        @InjectRepository(HoldersEntity)
        private holdersRepository: Repository<HoldersEntity>,
      ) {}

    async getTokenBalance(address: string): Promise<any> {
        try {
          const url = `${this.API_BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.API_KEY}`;
          
          // Make the HTTP request
          const response = await axios.get(url);
    
          // Handle errors from API response
          if (response.data.status !== '1') {
            throw new HttpException(
              response.data.message || 'Failed to fetch balance',
              HttpStatus.BAD_REQUEST,
            );
          }

          const data = [ { address: address, balance: response.data.result } ];

          //save to database
            // const holder = new HoldersEntity();
            // holder.address = address;
            // holder.balance = response.data.result;
            // await holder.save();

            const holder = this.holdersRepository.create({ address, balance: response.data.result });
            await this.holdersRepository.save(holder);
    
          return {
            message: 'Token balance fetched successfully',
            data,
          };
        } catch (error) {
          throw new HttpException(
            error.response?.data || 'Failed to fetch token balance',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }


      async getTransactions(address: string, page: number, offset: number, sort: string): Promise<any> {
        try {
          const url = `${this.API_BASE_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&page=${page}&offset=${offset}&sort=${sort}&apikey=${this.API_KEY}`;
    
          // Make the HTTP request
          const response = await axios.get(url);
    
          // Handle API-level errors
          if (response.data.status !== '1') {
            throw new HttpException(
              response.data.message || 'Failed to fetch transactions',
              HttpStatus.BAD_REQUEST,
            );
          }
    
          // Return formatted response
          return {
            message: 'Transactions fetched successfully',
            transactions: response.data.result, // Include only the 'result' field
          };
        } catch (error) {
          // Catch errors and provide a meaningful fallback message
          const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch transactions';
          throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}
