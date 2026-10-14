import { ApiProperty } from "@nestjs/swagger";

export class ScheduleResponseDto {
    @ApiProperty({ example: 'cjld2cjxh0000qzrmn831i7rn' })
    id: string;

    @ApiProperty({ example: 1, description: '1 = Пн, ..., 6 = Сб' })
    dayOfWeek: number;

    @ApiProperty({ example: 2, description: 'Номер пары' })
    pairNumber: number;

    @ApiProperty({ example: 1, description: '1 или 2 (неделя)' })
    weekNumber: number;

    @ApiProperty({ example: 'Основы электротехники' })
    subject: string;

    @ApiProperty({ example: 'Фисечко Р.С.', required: false })
    teacherName?: string | null;

    @ApiProperty({ example: 'С-210Б', required: false })
    room?: string | null;
}