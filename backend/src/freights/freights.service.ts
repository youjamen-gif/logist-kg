import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FreightsService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: any) {
    return this.prisma.freight.create({
      data: {
        ...data,
        createdByUserId: userId,
      },
    })
  }


  async findAll(query: any) {
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (query.originCity) where.originCity = query.originCity
    if (query.destinationCity) where.destinationCity = query.destinationCity
    if (query.truckType) where.truckType = query.truckType
    if (query.originCountry) where.originCountry = query.originCountry
    if (query.destinationCountry) where.destinationCountry = query.destinationCountry

    const [items, total] = await Promise.all([
      this.prisma.freight.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.freight.count({ where }),
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  findOne(id: string) {
    return this.prisma.freight.findUnique({
      where: { id },
    })
  }

  findMy(userId: string) {
    return this.prisma.freight.findMany({
      where: { createdByUserId: userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateOwn(userId: string, id: string, data: any) {
    const freight = await this.prisma.freight.findUnique({
      where: { id },
    })

    if (!freight) {
      throw new NotFoundException('Freight not found')
    }

    if (freight.createdByUserId !== userId) {
      throw new ForbiddenException('No access')
    }

    return this.prisma.freight.update({
      where: { id },
      data,
    })
  }

  async deleteOwn(userId: string, id: string) {
    const freight = await this.prisma.freight.findUnique({
      where: { id },
    })

    if (!freight) {
      throw new NotFoundException('Freight not found')
    }

    if (freight.createdByUserId !== userId) {
      throw new ForbiddenException('No access')
    }

    return this.prisma.freight.delete({
      where: { id },
    })
  }
}
