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
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FindAllStudentsQueryDto } from './dto/find-all-students-query.dto';
import { AuthGuard } from '../../shared/guards/auth.guards';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { RoleKey } from '../../shared/constants/rbac.constants';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER, RoleKey.STAFF)
  @ApiOperation({ summary: 'List all students (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of students' })
  findAll(@Query() query: FindAllStudentsQueryDto) {
    return this.studentService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER, RoleKey.STAFF)
  @ApiOperation({ summary: 'Find a student by ID' })
  @ApiResponse({ status: 200, description: 'Student found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Post()
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Patch(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN, RoleKey.MANAGER)
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({ status: 200, description: 'Student updated' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(RoleKey.SUPER_ADMIN, RoleKey.ADMIN)
  @ApiOperation({ summary: 'Delete a student' })
  @ApiResponse({ status: 200, description: 'Student deleted' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
