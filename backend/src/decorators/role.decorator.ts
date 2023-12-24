import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export type AllowedRoles = keyof typeof UserRole;

export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
