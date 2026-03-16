import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { UploadsService } from './uploads.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UploadAvatarDto } from './dto/upload-avatar.dto'
import { UploadDriverDocumentDto } from './dto/upload-driver-document.dto'
import { UploadCompanyDocumentDto } from './dto/upload-company-document.dto'
import { AttachVehicleDocumentDto } from './dto/attach-vehicle-document.dto'

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  uploadAvatar(@Req() req: any, @Body() body: UploadAvatarDto) {
    return this.uploadsService.uploadAvatar(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post('driver-document')
  uploadDriverDocument(@Req() req: any, @Body() body: UploadDriverDocumentDto) {
    return this.uploadsService.uploadDriverDocument(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post('company-document')
  uploadCompanyDocument(@Req() req: any, @Body() body: UploadCompanyDocumentDto) {
    return this.uploadsService.uploadCompanyDocument(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('vehicles/:vehicleId/document')
  attachVehicleDocument(
    @Req() req: any,
    @Param('vehicleId') vehicleId: string,
    @Body() body: AttachVehicleDocumentDto,
  ) {
    return this.uploadsService.attachVehicleDocument(req.user.id, vehicleId, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/driver-documents')
  getMyDriverDocuments(@Req() req: any) {
    return this.uploadsService.getMyDriverDocuments(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/company-documents')
  getMyCompanyDocuments(@Req() req: any) {
    return this.uploadsService.getMyCompanyDocuments(req.user.id)
  }
}
