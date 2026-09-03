import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleToUserDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsUUID('4')
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'role-uuid' })
  @IsUUID('4')
  @IsNotEmpty()
  roleId!: string;
}
