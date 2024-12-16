import axios from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { delay } from './delay.utils';

@Injectable()
export class BlockByTimestamp {
private FRAX_API_BASE_URL: string;
private FRAX_API_KEY: string;
private requestsPerSecond = 5;
private interval = 1000 / this.requestsPerSecond;
private lastRequestTime = 0;

constructor(private configService: ConfigService) {
    this.FRAX_API_BASE_URL = this.configService.get<string>('FraxBaseUrl');
    this.FRAX_API_KEY = this.configService.get<string>('FraxApiKey');
    
    if (!this.FRAX_API_BASE_URL || !this.FRAX_API_KEY) {
    throw new Error('FraxBaseUrl or FraxApiKey is not defined in environment variables');
    }
}

// Function to get block number by timestamp
async getBlockByTimestamp(timestamp: number): Promise<number> {
    const now = Date.now();
    // Ensure we respect the rate limit
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.interval) {
      await delay(this.interval - timeSinceLastRequest);
    }
    try {
        const params = {
            module: 'block',
            action: 'getblocknobytime',
            timestamp,
            closest: 'before',
            apikey: this.FRAX_API_KEY,
    };

    const response = await axios.get(this.FRAX_API_BASE_URL, { params });
    this.lastRequestTime = Date.now();

    // Validate and return the block number
    if (response.data && response.data.status === '1') {
        return parseInt(response.data.result, 10);
    } else {
        throw new HttpException(
        response.data.message || 'Error fetching block by timestamp',
        HttpStatus.BAD_REQUEST,
        );
    }
    } catch (error) {
    console.error('Error fetching block by timestamp:', error.message || error);

    // Handle known error cases or rethrow
    throw new HttpException(
        error.response?.data?.message || 'Failed to fetch block number',
        HttpStatus.INTERNAL_SERVER_ERROR,
    );
    }
}
}


