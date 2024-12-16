import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HoldersService } from '../holders.service';

@Injectable()
export class HoldersCron {
  constructor(private readonly holdersService: HoldersService) {}

  // Run every 6 hours
//   @Cron(CronExpression.EVERY_6_HOURS) 
@Cron(CronExpression.EVERY_5_MINUTES) 
  async fetchLogsJob() {
    console.log('Running cron job to fetch logs...');
    const address = '0xDcc0F2D8F90FDe85b10aC1c8Ab57dc0AE946A543';

    try {
        const result = await this.holdersService.getLogs(address);
        console.log(`Cron job completed: ${result.message}`);
      } catch (error) {
        console.error('Cron job failed:', error.message);
      }
  }
}
