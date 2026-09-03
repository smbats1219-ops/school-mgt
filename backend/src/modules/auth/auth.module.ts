import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptService } from '../../shared/security/bcrypt.service';
import { JwtTokenService } from '../../shared/security/jwt.service';
import { config } from '../../config/env.config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn as never },
    }),
  ],
  providers: [AuthService, BcryptService, JwtTokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
