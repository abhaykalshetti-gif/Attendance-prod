import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';

import { Attendance } from './entities/attendance.entity';
import { Users } from './entities/user.entity';
import { Roles } from './entities/role.entity';
import { UserRolesMapping } from './entities/User-Roles-Mapping'
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // DEFAULT DB
    TypeOrmModule.forRootAsync({
      name: 'default',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_DATABASE'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    // ATTENDANCE DB
    TypeOrmModule.forRootAsync({
      name: 'attendance',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_ATTENDANCE_DATABASE'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    // Default DB entities
    TypeOrmModule.forFeature([
      Users,
      Roles,
      UserRolesMapping,
    ]),

    // Attendance DB entity
    TypeOrmModule.forFeature(
      [Attendance],
      'attendance',
    ),
  ],

  // ✅ CONTROLLER MUST BE HERE
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
