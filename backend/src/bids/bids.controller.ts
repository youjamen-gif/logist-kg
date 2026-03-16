import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BidsService } from './bids.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateBidDto } from './dto/create-bid.dto'
import { UpdateBidStatusDto } from './dto/update-bid-status.dto'

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: CreateBidDto) {
    if (!['driver', 'admin'].includes(req.user.role)) {
      throw new ForbiddenException('Only driver can create bid')
    }

    return this.bidsService.create(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Req() req: any) {
    return this.bidsService.findMy(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('freight/:freightId')
  findFreightBids(@Req() req: any, @Param('freightId') freightId: string) {
    return this.bidsService.findFreightBids(req.user, freightId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateBidStatusDto,
  ) {
    return this.bidsService.updateStatus(req.user, id, body.status)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOwn(@Req() req: any, @Param('id') id: string) {
    return this.bidsService.deleteOwn(req.user.id, id)
  }
}