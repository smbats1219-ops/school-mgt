import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or controller) as public so that the AuthGuard skips
 * authentication. Useful for login / register endpoints.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
