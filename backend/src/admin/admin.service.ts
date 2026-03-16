import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  updateUserStatus(id: string, status: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: status as any },
    })
  }

  verifyPhone(id: string, value: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { phoneVerified: value },
    })
  }

  verifyDocuments(id: string, value: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { documentsVerified: value },
    })
  }

  getReports() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  updateReportStatus(id: string, status: string, moderatorComment?: string) {
    return this.prisma.report.update({
      where: { id },
      data: { status, moderatorComment },
    })
  }

  getSettings() {
    return this.prisma.systemSetting.findMany({
      orderBy: { updatedAt: 'desc' },
    })
  }

  async upsertSetting(key: string, value: string, updatedByUserId?: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: {
        value,
        updatedByUserId,
      },
      create: {
        key,
        value,
        updatedByUserId,
      },
    })
  }

  getDriverDocuments() {
    return this.prisma.driverDocument.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            documentsVerified: true,
          },
        },
      },
    })
  }

  getCompanyDocuments() {
    return this.prisma.companyDocument.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            documentsVerified: true,
          },
        },
      },
    })
  }

  async updateDriverDocumentStatus(id: string, status: string) {
    const doc = await this.prisma.driverDocument.update({
      where: { id },
      data: { status },
    })

    await this.refreshUserDocumentsVerified(doc.userId)
    return doc
  }

  async updateCompanyDocumentStatus(id: string, status: string) {
    const doc = await this.prisma.companyDocument.update({
      where: { id },
      data: { status },
    })

    await this.refreshUserDocumentsVerified(doc.userId)
    return doc
  }

  async refreshUserDocumentsVerified(userId: string) {
    const [driverDocs, companyDocs] = await Promise.all([
      this.prisma.driverDocument.findMany({ where: { userId } }),
      this.prisma.companyDocument.findMany({ where: { userId } }),
    ])

    const allDocs = [...driverDocs, ...companyDocs]

    const hasDocs = allDocs.length > 0
    const allApproved = hasDocs && allDocs.every((item) => item.status === 'approved')

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        documentsVerified: allApproved,
      },
    })
  }
}
