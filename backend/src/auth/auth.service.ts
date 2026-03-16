import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const exists = await this.usersService.findByEmail(data.email)

    if (exists) {
      throw new BadRequestException('Email already exists')
    }

    const hash = await bcrypt.hash(data.password, 10)

    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      phone: data.phone,
      passwordHash: hash,
      role: data.role,
    })

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      accessToken: token,
    }
  }

  async login(data: any) {
    const user = await this.usersService.findByEmail(data.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const match = await bcrypt.compare(data.password, user.passwordHash)

    if (!match) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.status === 'blocked') {
      throw new UnauthorizedException('User is blocked')
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      accessToken: token,
    }
  }
}
