import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
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
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService, JwtTokenService],
  exports: [TeacherService],
})
export class TeacherModule {}
