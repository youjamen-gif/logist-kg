import { Module } from '@nestjs/common'
import { JwtModule, JwtSignOptions } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { RolesGuard } from './roles.guard'
import { Reflector } from '@nestjs/core'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersService } from '../users/users.service'
import { PrismaService } from '../prisma/prisma.service'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'change_me_access',
      signOptions: { expiresIn: (process.env.JWT_ACCESS_EXPIRES as any) || '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    PrismaService,
    JwtStrategy,
    RolesGuard,
    Reflector,
  ],
  exports: [RolesGuard],
})
export class AuthModule {}
