import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { FreightsService } from './freights.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateFreightDto } from './dto/create-freight.dto'
import { UpdateFreightDto } from './dto/update-freight.dto'

@Controller('freights')
export class FreightsController {
  constructor(private freightsService: FreightsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: CreateFreightDto) {
    if (!['shipper', 'dispatcher', 'admin'].includes(req.user.role)) {
      throw new ForbiddenException('Only shipper or dispatcher can create freight')
    }
    return this.freightsService.create(req.user.id, body)
  }

  @Get()
  findAll(@Query() query: any) {
    return this.freightsService.findAll(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req: any) {
    return this.freightsService.findMy(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freightsService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateOwn(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateFreightDto,
  ) {
    return this.freightsService.updateOwn(req.user.id, id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOwn(@Req() req: any, @Param('id') id: string) {
    return this.freightsService.deleteOwn(req.user.id, id)
  }
}
