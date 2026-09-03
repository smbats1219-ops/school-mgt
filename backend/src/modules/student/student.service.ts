import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../db/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FindAllStudentsQueryDto } from './dto/find-all-students-query.dto';
import { PaginatedResult } from '../../shared/interfaces/paginated.interface';

const STUDENT_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  dateOfBirth: true,
  createdAt: true,
  updatedAt: true,
  enrollments: {
    select: {
      id: true,
      academicYear: true,
      status: true,
      class: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.StudentSelect;

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    await this.assertUniqueEmail(createStudentDto.email);

    const student = await this.prismaService.student.create({
      data: {
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
        email: createStudentDto.email,
        dateOfBirth: new Date(createStudentDto.dateOfBirth),
      },
      select: STUDENT_SELECT,
    });

    return student;
  }

  async findAll(
    query: FindAllStudentsQueryDto,
  ): Promise<PaginatedResult<unknown>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.StudentWhereInput = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.student.findMany({
        where,
        select: STUDENT_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.student.count({ where }),
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
    const student = await this.prismaService.student.findUnique({
      where: { id },
      select: STUDENT_SELECT,
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);

    if (updateStudentDto.email !== undefined) {
      await this.assertUniqueEmail(updateStudentDto.email, id);
    }

    try {
      const student = await this.prismaService.student.update({
        where: { id },
        data: {
          ...(updateStudentDto.firstName !== undefined && {
            firstName: updateStudentDto.firstName,
          }),
          ...(updateStudentDto.lastName !== undefined && {
            lastName: updateStudentDto.lastName,
          }),
          ...(updateStudentDto.email !== undefined && {
            email: updateStudentDto.email,
          }),
          ...(updateStudentDto.dateOfBirth !== undefined && {
            dateOfBirth: new Date(updateStudentDto.dateOfBirth),
          }),
        },
        select: STUDENT_SELECT,
      });

      return student;
    } catch {
      throw new BadRequestException('Email already exists');
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.student.delete({ where: { id } });
    return { message: 'Student deleted successfully' };
  }

  private async assertUniqueEmail(
    email: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.prismaService.student.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing && existing.id !== excludeId) {
      throw new BadRequestException('Email already exists');
    }
  }
}
