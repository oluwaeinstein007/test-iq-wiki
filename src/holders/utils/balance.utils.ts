import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HoldersEntity } from '../entities/holders.entity';

@Injectable()
export class BalanceUtil {
  constructor(
    @InjectRepository(HoldersEntity)
    private readonly holdersRepository: Repository<HoldersEntity>
  ) {}

  public async saveBalancesToDatabase(balances: Map<string, bigint>): Promise<void> {
    for (const [holderAddress, balance] of balances.entries()) {
      const existingHolder = await this.holdersRepository.findOne({
        where: { address: holderAddress },
      });

      if (existingHolder) {
        existingHolder.balance = BigInt(existingHolder.balance) + balance;
        await this.holdersRepository.save(existingHolder);
      } else {
        const newHolder = this.holdersRepository.create({
          address: holderAddress,
          balance,
        });
        await this.holdersRepository.save(newHolder);
      }
    }
  }
}

