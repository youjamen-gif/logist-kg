
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { FreightsModule } from './freights/freights.module';
import { BidsModule } from './bids/bids.module';
import { SettingsModule } from './settings/settings.module';

import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FreightsModule,
    BidsModule,
    SettingsModule,
    ReportsModule,
    UploadsModule,
  ],
  // ...existing code...
})
export class AppModule {}