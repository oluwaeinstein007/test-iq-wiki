import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { HoldersController } from './holders.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { HoldersEntity } from './holders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HoldersEntity])],
  providers: [HoldersService],
  controllers: [HoldersController]
})
export class HoldersModule {}
