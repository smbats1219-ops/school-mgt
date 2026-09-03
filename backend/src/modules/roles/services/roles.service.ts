import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../db/prisma.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { AssignRoleToUserDto } from '../dto/assign-role-to-user.dto';

const ROLE_SELECT = {
  id: true,
  role_key: true,
  name: true,
  description: true,
  isSystemRole: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  rolePermissions: {
    select: {
      permission: {
        select: {
          id: true,
          permissionKey: true,
          name: true,
          permissionModule: {
            select: { moduleKey: true, name: true },
          },
        },
      },
    },
  },
} as const;

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const existing = await this.prismaService.role.findFirst({
      where: {
        OR: [
          { role_key: createRoleDto.role_key },
          { name: createRoleDto.name },
        ],
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Role key or name already exists');
    }

    return this.prismaService.role.create({
      data: {
        role_key: createRoleDto.role_key,
        name: createRoleDto.name,
        description: createRoleDto.description,
        isSystemRole: createRoleDto.isSystemRole ?? false,
      },
      select: ROLE_SELECT,
    });
  }

  async findAll() {
    return this.prismaService.role.findMany({
      select: ROLE_SELECT,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const role = await this.prismaService.role.findUnique({
      where: { id },
      select: ROLE_SELECT,
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id);

    if (updateRoleDto.role_key || updateRoleDto.name) {
      const existing = await this.prismaService.role.findFirst({
        where: {
          OR: [
            ...(updateRoleDto.role_key
              ? [{ role_key: updateRoleDto.role_key }]
              : []),
            ...(updateRoleDto.name ? [{ name: updateRoleDto.name }] : []),
          ],
          NOT: { id },
        },
        select: { id: true },
      });

      if (existing) {
        throw new BadRequestException('Role key or name already exists');
      }
    }

    return this.prismaService.role.update({
      where: { id },
      data: {
        ...(updateRoleDto.role_key !== undefined && {
          role_key: updateRoleDto.role_key,
        }),
        ...(updateRoleDto.name !== undefined && {
          name: updateRoleDto.name,
        }),
        ...(updateRoleDto.description !== undefined && {
          description: updateRoleDto.description,
        }),
        ...(updateRoleDto.isSystemRole !== undefined && {
          isSystemRole: updateRoleDto.isSystemRole,
        }),
      },
      select: ROLE_SELECT,
    });
  }

  async assignPermissions(
    roleId: string,
    dto: AssignPermissionsDto,
    grantedById: string,
  ) {
    await this.findOne(roleId);

    const existingPermissions =
      await this.prismaService.rolePermission.findMany({
        where: { roleId },
        select: { permissionId: true },
      });

    const existingIds = new Set(
      existingPermissions.map((item) => item.permissionId),
    );

    const newPermissionIds = dto.permissionIds.filter(
      (id) => !existingIds.has(id),
    );

    if (newPermissionIds.length > 0) {
      await this.prismaService.rolePermission.createMany({
        data: newPermissionIds.map((permissionId) => ({
          roleId,
          permissionId,
          grantedById,
        })),
        skipDuplicates: true,
      });
    }

    return this.findOne(roleId);
  }

  async removePermissionsFromRole(roleId: string, permissionIds: string[]) {
    await this.findOne(roleId);

    await this.prismaService.rolePermission.deleteMany({
      where: { roleId, permissionId: { in: permissionIds } },
    });

    return this.findOne(roleId);
  }

  async assignRoleToUser(dto: AssignRoleToUserDto, assignedById: string) {
    await this.findOne(dto.roleId);

    const user = await this.prismaService.user.findUnique({
      where: { id: dto.userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const existing = await this.prismaService.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: dto.userId,
          roleId: dto.roleId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Role already assigned to this user');
    }

    return this.prismaService.userRole.create({
      data: {
        userId: dto.userId,
        roleId: dto.roleId,
        assignedById,
      },
      select: {
        id: true,
        assignedAt: true,
        role: { select: { role_key: true, name: true } },
        user: { select: { id: true, username: true, fullName: true } },
      },
    });
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    await this.prismaService.userRole.deleteMany({
      where: { userId, roleId },
    });

    return { message: 'Role removed from user' };
  }

  async remove(id: string) {
    const role = await this.findOne(id);

    if (role.isSystemRole) {
      throw new BadRequestException('System roles cannot be deleted');
    }

    await this.prismaService.role.delete({ where: { id } });

    return { message: 'Role deleted successfully' };
  }
}
