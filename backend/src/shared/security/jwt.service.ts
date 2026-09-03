import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { config } from '../../config/env.config';

export interface JwtPayload {
  sub: string;
  id?: string;
  email?: string;
  username?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: JwtPayload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, {
      secret: config.jwt.secret,
      expiresIn: config.jwt.expiresIn as JwtSignOptions['expiresIn'],
      ...options,
    });
  }

  generateAccessToken(
    userId: string,
    email: string,
    options?: JwtSignOptions,
  ): string {
    return this.sign({ sub: userId, email }, options);
  }

  verify<T extends JwtPayload = JwtPayload>(
    token: string,
    options?: JwtVerifyOptions,
  ): T {
    try {
      return this.jwtService.verify<T>(token, {
        secret: config.jwt.secret,
        ...options,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  validate<T extends JwtPayload = JwtPayload>(
    token: string,
    options?: JwtVerifyOptions,
  ): T {
    return this.verify<T>(token, options);
  }

  decode<T extends object = JwtPayload>(token: string): T | null {
    const payload: unknown = this.jwtService.decode(token);

    if (payload === null || typeof payload !== 'object') {
      return null;
    }

    return payload as T;
  }

  extractBearerToken(authorization?: string): string | null {
    if (!authorization) {
      return null;
    }

    const [scheme, token] = authorization.trim().split(/\s+/);
    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }

  getExpirationDate(token: string): Date | null {
    const payload = this.decode<JwtPayload>(token);
    return payload?.exp ? new Date(payload.exp * 1000) : null;
  }

  isExpired(token: string): boolean {
    const expirationDate = this.getExpirationDate(token);
    return expirationDate ? expirationDate.getTime() <= Date.now() : true;
  }
}
