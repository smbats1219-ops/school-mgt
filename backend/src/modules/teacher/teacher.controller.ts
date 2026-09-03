import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FindAllTeachersQueryDto } from './dto/find-all-teachers-query.dto';
import { AuthGuard } from '../../shared/guards/auth.guards';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RoleKey } from '../../shared/constants/rbac.constants';

@ApiTags('teachers')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER, RoleKey.STAFF)
  @ApiOperation({ summary: 'List all teachers (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of teachers' })
  findAll(@Query() query: FindAllTeachersQueryDto) {
    return this.teacherService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER, RoleKey.STAFF)
  @ApiOperation({ summary: 'Find a teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher found' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Post()
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER)
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created' })
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Patch(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER)
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher updated' })
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN)
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher deleted' })
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}
