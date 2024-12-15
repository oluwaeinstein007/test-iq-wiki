import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { HoldersController } from './holders.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { HoldersEntity } from './holders.entity';
import { Logger } from './logger.entity';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([HoldersEntity, Logger]),
  ],
  providers: [HoldersService],
  controllers: [HoldersController]
})
export class HoldersModule {}
