import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { testTypeOrmConfig, getTypeOrmConfig } from 'src/config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          return testTypeOrmConfig();
        }

        return getTypeOrmConfig(configService);
      },
    }),
  ],
})
export class DatabaseModule {}
