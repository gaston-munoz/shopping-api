import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '../interfaces/roles.interface';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guars/user-role.guard';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  )
}