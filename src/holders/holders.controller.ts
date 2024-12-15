import { Controller, Get, Query } from '@nestjs/common';
import { HoldersService } from './holders.service';

@Controller('holders')
export class HoldersController {
    constructor(private readonly holdersService: HoldersService) {}

    @Get('logs')
    async getLogs(@Query('address') address: string) {
        if (!address) {
        return { error: 'Address is required' };
        }

        return await this.holdersService.getLogs(address);
    }

}
