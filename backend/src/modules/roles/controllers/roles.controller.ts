import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { AssignPermissionsDto } from '../dto/assign-permissions.dto';
import { AssignRoleToUserDto } from '../dto/assign-role-to-user.dto';
import { AuthGuard } from '../../../shared/guards/auth.guards';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { RoleKey } from '../../../shared/constants/rbac.constants';
import type { AuthenticatedUser } from '../../../shared/interfaces/authenticated-user.interface';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN)
  @ApiOperation({ summary: 'List all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN)
  @ApiOperation({ summary: 'Find a role by ID' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Roles(RoleKey.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  @Roles(RoleKey.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Patch(':id/permissions')
  @Roles(RoleKey.SUPER_ADMIN)
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiResponse({ status: 200, description: 'Permissions assigned' })
  assignPermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rolesService.assignPermissions(id, dto, user.id);
  }

  @Delete(':id/permissions')
  @Roles(RoleKey.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiResponse({ status: 200, description: 'Permissions removed' })
  removePermissions(
    @Param('id') id: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.rolesService.removePermissionsFromRole(id, dto.permissionIds);
  }

  @Post('assign')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 201, description: 'Role assigned to user' })
  assignRoleToUser(
    @Body() dto: AssignRoleToUserDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rolesService.assignRoleToUser(dto, user.id);
  }

  @Delete('assign/:userId/:roleId')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN)
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiResponse({ status: 200, description: 'Role removed from user' })
  removeRoleFromUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.rolesService.removeRoleFromUser(userId, roleId);
  }

  @Delete(':id')
  @Roles(RoleKey.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 200, description: 'Role deleted' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
