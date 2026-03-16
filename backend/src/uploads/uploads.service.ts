import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  uploadAvatar(userId: string, body: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: body.fileUrl,
      },
      select: {
        id: true,
        avatarUrl: true,
      },
    })
  }

  uploadDriverDocument(userId: string, body: any) {
    return this.prisma.driverDocument.create({
      data: {
        userId,
        type: body.type,
        fileUrl: body.fileUrl,
        status: 'pending',
      },
    })
  }

  uploadCompanyDocument(userId: string, body: any) {
    return this.prisma.companyDocument.create({
      data: {
        userId,
        type: body.type,
        fileUrl: body.fileUrl,
        status: 'pending',
      },
    })
  }

  async attachVehicleDocument(userId: string, vehicleId: string, body: any) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found')
    }

    if (vehicle.driverUserId !== userId) {
      throw new ForbiddenException('No access')
    }

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        techPassportUrl: body.fileUrl,
      },
    })
  }

  getMyDriverDocuments(userId: string) {
    return this.prisma.driverDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  getMyCompanyDocuments(userId: string) {
    return this.prisma.companyDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
