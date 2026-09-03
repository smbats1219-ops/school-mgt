import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../db/prisma.service';
import { BcryptService } from '../../shared/security/bcrypt.service';
import { JwtTokenService } from '../../shared/security/jwt.service';
import { config } from '../../config/env.config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn as never },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, BcryptService, JwtTokenService],
  exports: [UsersService],
})
export class UsersModule {}
