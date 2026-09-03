import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
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
  controllers: [StudentController],
  providers: [StudentService, PrismaService, JwtTokenService],
  exports: [StudentService],
})
export class StudentModule {}
