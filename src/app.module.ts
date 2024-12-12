import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HoldersModule } from './holders/holders.module';

@Module({
  // imports: [],
  imports: [
    ConfigModule.forRoot(), // Loads environment variables from .env file
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'my_database',
      autoLoadEntities: true, // Automatically loads entities
      synchronize: true, // Automatically creates tables based on entities (use only in dev)
    }), HoldersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
