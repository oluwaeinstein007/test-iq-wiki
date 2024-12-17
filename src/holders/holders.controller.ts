import { Controller, Get, Query } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { response } from 'express';

@Controller('holders')
export class HoldersController {
    constructor(private readonly holdersService: HoldersService) {}

    @Get('logs')
    async getLogs(@Query('address') address: string) {
        return await this.holdersService.getLogs(address);
    }


    @Get('balances')
    async getBalances(
    @Query('address') address?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    ): Promise<{ message: string; data: any[] }> {
        const data = await this.holdersService.getBalances(address, page, limit);
        return {
            message: 'Data fetched successfully',
            data: data,
        };
    }


}
