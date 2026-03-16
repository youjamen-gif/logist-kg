import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.usersService.findMe(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() body: UpdateProfileDto) {
    return this.usersService.updateMe(req.user.id, body)
  }

  @Get(':id')
  findPublic(@Param('id') id: string) {
    return this.usersService.findPublicById(id)
  }
}
