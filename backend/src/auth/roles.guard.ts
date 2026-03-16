import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) return false

    return this.roles.includes(user.role)
  }
}
