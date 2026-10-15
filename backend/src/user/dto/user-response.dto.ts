import { ApiProperty } from '@nestjs/swagger';
import { GroupResponseDto } from '../../groups/dto/GroupResponseDto.dto';

export class UserResponseDto {
  @ApiProperty({ example: '5b1c...uuid' })
  id: string;

  @ApiProperty({ example: '12345' })
  maxUserId: string;

  @ApiProperty({ example: 'Тимофей', required: false, nullable: true })
  firstName: string | null;

  @ApiProperty({ example: 'timka', required: false, nullable: true })
  username: string | null;

  @ApiProperty({ example: 'STUDENT', enum: ['STUDENT', 'TEACHER'] })
  role: 'STUDENT' | 'TEACHER';

  @ApiProperty({ type: GroupResponseDto, required: false, nullable: true })
  group: GroupResponseDto | null;

  @ApiProperty({ example: '2026-10-15T10:00:00.000Z' })
  createdAt: Date;
}