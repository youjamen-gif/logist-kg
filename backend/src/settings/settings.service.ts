import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getPublicSettings() {
    const items = await this.prisma.systemSetting.findMany()

    const result: Record<string, string> = {}

    for (const item of items) {
      result[item.key] = item.value
    }

    return result
  }
}
