import { Entity, Column, PrimaryGeneratedColumn, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index('idx_address', ['address'])
export class HoldersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ unique: true }) 
  address: string;

  @Column('bigint', { default: 0 })
  balance: bigint;

}