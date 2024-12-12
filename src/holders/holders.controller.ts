import { Controller, Get, Query } from '@nestjs/common';
import { HoldersService } from './holders.service';

@Controller('holders')
export class HoldersController {
    constructor(private readonly holdersService: HoldersService) {}

    @Get('balance')
    async getBalance(@Query('address') address: string) {
        if (!address) {
        return { error: 'Address is required' };
        }

        return await this.holdersService.getTokenBalance(address);
    }

    @Get('transactions')
    async getTransactions(
        @Query('address') address: string,
        @Query('page') page: number = 1,
        @Query('offset') offset: number = 10,
        @Query('sort') sort: string = 'asc',
    ) {
        if (!address) {
        throw new Error('Address is required');
        }

        return this.holdersService.getTransactions(address, page, offset, sort);
  }
}
