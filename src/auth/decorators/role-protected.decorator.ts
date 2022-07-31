import { SetMetadata } from '@nestjs/common';
import { Role } from '../interfaces/roles.interface';

const NAME_ROLES: string = 'roles'

export const RoleProtected = (...args: Role[]) => {
    console.log('ARGS', args);
    
    return SetMetadata(NAME_ROLES, args)
}
