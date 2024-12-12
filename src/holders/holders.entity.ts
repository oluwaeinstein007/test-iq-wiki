import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HoldersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  address: string;

  @Column('decimal', { default: 0 })
  balance: number;
}
