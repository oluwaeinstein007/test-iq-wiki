import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HoldersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  // @Column('decimal', { precision: 30, scale: 0, default: 0 })
  // balance: number;

  @Column('bigint', { default: 0 })
  balance: bigint;

}
