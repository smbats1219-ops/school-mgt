import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../db/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FindAllTeachersQueryDto } from './dto/find-all-teachers-query.dto';
import { PaginatedResult } from '../../shared/interfaces/paginated.interface';

const TEACHER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  subjects: {
    select: {
      id: true,
      name: true,
      code: true,
      class: { select: { id: true, name: true } },
    },
  },
  classes: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.TeacherSelect;

@Injectable()
export class TeacherService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    await this.assertUniqueEmail(createTeacherDto.email);

    const teacher = await this.prismaService.teacher.create({
      data: {
        firstName: createTeacherDto.firstName,
        lastName: createTeacherDto.lastName,
        email: createTeacherDto.email,
      },
      select: TEACHER_SELECT,
    });

    return teacher;
  }

  async findAll(
    query: FindAllTeachersQueryDto,
  ): Promise<PaginatedResult<unknown>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TeacherWhereInput = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.teacher.findMany({
        where,
        select: TEACHER_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.teacher.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const teacher = await this.prismaService.teacher.findUnique({
      where: { id },
      select: TEACHER_SELECT,
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    await this.findOne(id);

    if (updateTeacherDto.email !== undefined) {
      await this.assertUniqueEmail(updateTeacherDto.email, id);
    }

    try {
      const teacher = await this.prismaService.teacher.update({
        where: { id },
        data: {
          ...(updateTeacherDto.firstName !== undefined && {
            firstName: updateTeacherDto.firstName,
          }),
          ...(updateTeacherDto.lastName !== undefined && {
            lastName: updateTeacherDto.lastName,
          }),
          ...(updateTeacherDto.email !== undefined && {
            email: updateTeacherDto.email,
          }),
        },
        select: TEACHER_SELECT,
      });

      return teacher;
    } catch {
      throw new BadRequestException('Email already exists');
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.teacher.delete({ where: { id } });
    return { message: 'Teacher deleted successfully' };
  }

  private async assertUniqueEmail(
    email: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prismaService.teacher.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Email already exists');
    }
  }
}
