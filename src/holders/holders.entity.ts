import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HoldersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column('bigint', { default: 0 })
  balance: bigint;

}
