import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  timestamp: number;

  @Column({ type: 'int' })
  blockNumber: number;
}

