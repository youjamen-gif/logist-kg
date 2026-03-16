import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateReportDto } from './dto/create-report.dto'

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: CreateReportDto) {
    return this.reportsService.create(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req: any) {
    return this.reportsService.findMy(req.user.id)
  }
}
