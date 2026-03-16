import { Module } from '@nestjs/common'
import { FreightsController } from './freights.controller'
import { FreightsService } from './freights.service'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [FreightsController],
  providers: [FreightsService, PrismaService],
})
export class FreightsModule {}
