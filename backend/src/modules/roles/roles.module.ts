import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { PrismaService } from '../../db/prisma.service';
import { JwtTokenService } from '../../shared/security/jwt.service';
import { config } from '../../config/env.config';

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn as never },
    }),
  ],
  controllers: [RolesController],
  providers: [RolesService, PrismaService, JwtTokenService],
  exports: [RolesService],
})
export class RolesModule {}
