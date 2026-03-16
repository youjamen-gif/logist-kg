import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: any) {
    return this.prisma.vehicle.create({
      data: {
        driverUserId: userId,
        plateNumber: data.plateNumber,
        trailerNumber: data.trailerNumber,
        truckType: data.truckType,
        capacity: data.capacity,
        dimensions: data.dimensions,
      },
    })
  }

  findMyVehicles(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { driverUserId: userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async delete(userId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    })

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found')
    }

    if (vehicle.driverUserId !== userId) {
      throw new ForbiddenException('No access')
    }

    return this.prisma.vehicle.delete({
      where: { id },
    })
  }
}
