import { Role } from '../enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const Roles = (role: Role[]) => SetMetadata('role', role);
