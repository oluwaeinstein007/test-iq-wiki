import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Logger {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: 'int', unique: true })
  timestamp: number;

  @Column({ type: 'int' })
  blockNumber: number;
}

