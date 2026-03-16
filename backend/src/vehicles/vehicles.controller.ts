import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateVehicleDto } from './dto/create-vehicle.dto'

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: CreateVehicleDto) {
    return this.vehiclesService.create(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  myVehicles(@Req() req: any) {
    return this.vehiclesService.findMyVehicles(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.vehiclesService.delete(req.user.id, id)
  }
}
