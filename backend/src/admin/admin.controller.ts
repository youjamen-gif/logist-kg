import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto'

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers()
  }

  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUserStatus(id, body.status)
  }

  @Patch('users/:id/verify-phone')
  verifyPhone(@Param('id') id: string, @Body() body: any) {
    return this.adminService.verifyPhone(id, body.phoneVerified)
  }

  @Patch('users/:id/verify-documents')
  verifyDocuments(@Param('id') id: string, @Body() body: any) {
    return this.adminService.verifyDocuments(id, body.documentsVerified)
  }

  @Get('reports')
  getReports() {
    return this.adminService.getReports()
  }

  @Patch('reports/:id/status')
  updateReportStatus(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateReportStatus(
      id,
      body.status,
      body.moderatorComment,
    )
  }

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings()
  }

  @Post('settings')
  upsertSetting(@Req() req: any, @Body() body: any) {
    return this.adminService.upsertSetting(body.key, body.value, req.user.id)
  }

  @Get('driver-documents')
  getDriverDocuments() {
    return this.adminService.getDriverDocuments()
  }

  @Get('company-documents')
  getCompanyDocuments() {
    return this.adminService.getCompanyDocuments()
  }

  @Patch('driver-documents/:id/status')
  updateDriverDocumentStatus(
    @Param('id') id: string,
    @Body() body: UpdateDocumentStatusDto,
  ) {
    return this.adminService.updateDriverDocumentStatus(id, body.status)
  }

  @Patch('company-documents/:id/status')
  updateCompanyDocumentStatus(
    @Param('id') id: string,
    @Body() body: UpdateDocumentStatusDto,
  ) {
    return this.adminService.updateCompanyDocumentStatus(id, body.status)
  }
}
