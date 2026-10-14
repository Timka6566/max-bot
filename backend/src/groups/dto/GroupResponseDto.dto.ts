import { ApiProperty } from "@nestjs/swagger";

export class GroupResponseDto {
    @ApiProperty({ example: 'cjld2cjxh0000qzrmn831i7rn' })
    id: string;

    @ApiProperty({ example: "25-КС-02" })
    fullName: string;

    @ApiProperty({ example: '25' })
    year: string;

    @ApiProperty({ example: 'КС' })
    specialtyCode: string;

    @ApiProperty({ example: 'Компьютерные системы', required: false })
    specialtyName?: string | null;

    @ApiProperty({ example: '02' })
    groupNumber: string;
}