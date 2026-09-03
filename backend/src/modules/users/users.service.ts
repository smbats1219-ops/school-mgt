import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../db/prisma.service';
import { BcryptService } from '../../shared/security/bcrypt.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { PaginatedResult } from '../../shared/interfaces/paginated.interface';

const USER_SELECT = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  profilePictureUrl: true,
  status: true,
  lastLoginAt: true,
  isPasswordChanged: true,
  passwordChangedAt: true,
  createdAt: true,
  updatedAt: true,
  userRoles: {
    select: {
      role: {
        select: { id: true, role_key: true, name: true },
      },
    },
  },
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.assertUniqueFields(createUserDto.username, createUserDto.email);

    const hashedPassword = await this.bcryptService.hash(
      createUserDto.password,
    );

    const user = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        fullName: createUserDto.fullName,
        phoneNumber: createUserDto.phoneNumber,
        profilePictureUrl: createUserDto.profilePictureUrl,
        passwordHash: hashedPassword,
      },
      select: USER_SELECT,
    });

    return user;
  }

  async findAll(
    query: FindAllUsersQueryDto,
  ): Promise<PaginatedResult<unknown>> {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: USER_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.user.count({ where }),
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
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        status: true,
        passwordHash: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        status: true,
        passwordHash: true,
      },
    });
  }

  async findByLogin(identifier: string): Promise<{
    id: string;
    username: string;
    email: string | null;
    fullName: string;
    status: string;
    passwordHash: string;
  } | null> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        status: true,
        passwordHash: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (
      updateUserDto.username !== undefined ||
      updateUserDto.email !== undefined
    ) {
      await this.assertUniqueFields(
        updateUserDto.username,
        updateUserDto.email,
        id,
      );
    }

    try {
      const user = await this.prismaService.user.update({
        where: { id },
        data: {
          ...(updateUserDto.username !== undefined && {
            username: updateUserDto.username,
          }),
          ...(updateUserDto.email !== undefined && {
            email: updateUserDto.email,
          }),
          ...(updateUserDto.fullName !== undefined && {
            fullName: updateUserDto.fullName,
          }),
          ...(updateUserDto.phoneNumber !== undefined && {
            phoneNumber: updateUserDto.phoneNumber,
          }),
          ...(updateUserDto.profilePictureUrl !== undefined && {
            profilePictureUrl: updateUserDto.profilePictureUrl,
          }),
        },
        select: USER_SELECT,
      });

      return user;
    } catch {
      throw new BadRequestException('Username or email already exists');
    }
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id);

    return this.prismaService.user.update({
      where: { id },
      data: { status: status as never },
      select: USER_SELECT,
    });
  }

  async findRoleKeysByUserId(userId: string): Promise<string[]> {
    const roles = await this.prismaService.userRole.findMany({
      where: { userId },
      select: { role: { select: { role_key: true } } },
    });

    return roles.map((item) => item.role.role_key);
  }

  async updateLastLogin(id: string) {
    return this.prismaService.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      select: { id: true, lastLoginAt: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }

  private async assertUniqueFields(
    username?: string,
    email?: string,
    excludeId?: string,
  ): Promise<void> {
    if (username) {
      const existing = await this.prismaService.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (existing && existing.id !== excludeId) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (email) {
      const existing = await this.prismaService.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing && existing.id !== excludeId) {
        throw new BadRequestException('Email already exists');
      }
    }
  }
}
