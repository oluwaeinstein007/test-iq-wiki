import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { HoldersController } from './holders.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { HoldersEntity } from './entities/holders.entity';
import { Logger } from './entities/logger.entity';
import { HoldersCron } from './cron/holders.cron';
import { BalanceUtil } from './utils/balance.utils';
import { BlockByTimestamp} from './utils/block.utils';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([HoldersEntity, Logger]),
  ],
  // providers: [HoldersService, HoldersCron],
  providers: [HoldersService, BalanceUtil, BlockByTimestamp],
  controllers: [HoldersController]
})
export class HoldersModule {}
