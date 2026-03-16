import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: any) {
    return this.prisma.report.create({
      data: {
        createdByUserId: userId,
        targetEntityType: data.targetEntityType,
        targetEntityId: data.targetEntityId,
        reportType: data.reportType,
        message: data.message,
      },
    })
  }

  findMy(userId: string) {
    return this.prisma.report.findMany({
      where: { createdByUserId: userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
