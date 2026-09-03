import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants/rbac.constants';

/**
 * Declares the role keys required to access a route or controller.
 * Used together with the RolesGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
