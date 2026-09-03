import { IsNotEmpty, IsUUID } from 'class-validator';
import { ArrayMinSize, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({
    type: [String],
    example: ['permission-id-1', 'permission-id-2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  permissionIds!: string[];
}
