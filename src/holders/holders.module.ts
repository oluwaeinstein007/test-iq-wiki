import { Module } from '@nestjs/common';
import { HoldersService } from './holders.service';
import { HoldersController } from './holders.controller';

@Module({
  providers: [HoldersService],
  controllers: [HoldersController]
})
export class HoldersModule {}
