import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  async create(driverId: string, data: any) {
    const freight = await this.prisma.freight.findUnique({
      where: { id: data.freightId },
    })

    if (!freight) {
      throw new NotFoundException('Freight not found')
    }

    return this.prisma.bid.create({
      data: {
        freightId: data.freightId,
        driverUserId: driverId,
        price: data.price,
        message: data.message,
      },
    })
  }

  async findMy(driverId: string) {
    return this.prisma.bid.findMany({
      where: { driverUserId: driverId },
      orderBy: { createdAt: 'desc' },
      include: {
        freight: true,
      },
    })
  }

  async findFreightBids(user: any, freightId: string) {
    const freight = await this.prisma.freight.findUnique({
      where: { id: freightId },
    })

    if (!freight) {
      throw new NotFoundException('Freight not found')
    }

    if (user.role !== 'admin' && freight.createdByUserId !== user.id) {
      throw new ForbiddenException('No access to freight bids')
    }

    return this.prisma.bid.findMany({
      where: { freightId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateStatus(user: any, id: string, status: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id },
      include: { freight: true },
    })

    if (!bid) {
      throw new NotFoundException('Bid not found')
    }

    if (user.role !== 'admin' && bid.freight.createdByUserId !== user.id) {
      throw new ForbiddenException('No access to update bid')
    }

    return this.prisma.bid.update({
      where: { id },
      data: { status },
    })
  }

  async deleteOwn(driverId: string, id: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id },
    })

    if (!bid) {
      throw new NotFoundException('Bid not found')
    }

    if (bid.driverUserId !== driverId) {
      throw new ForbiddenException('No access')
    }

    return this.prisma.bid.delete({
      where: { id },
    })
  }
}