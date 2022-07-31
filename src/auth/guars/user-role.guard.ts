import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get('roles', context.getHandler())
    const user = context.switchToHttp().getRequest().user

    if (!validRoles || !validRoles.length) return true

    if (!user)
      throw new BadRequestException('User not found')

    const { roles } = user
    for (let role of roles) {
      if (validRoles.includes(role))
        return true
    }

    throw new UnauthorizedException('Not authorized to access this resource')
  }
}
