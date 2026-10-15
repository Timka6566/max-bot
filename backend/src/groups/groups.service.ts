import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(search?: string) {
        return this.prisma.group.findMany({
            where: search
                ? {
                    OR: [
                        { fullName: { contains: search, mode: 'insensitive' } },
                        { specialtyCode: { contains: search, mode: 'insensitive' } },
                        { specialtyName: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            orderBy: [{ year: 'desc' }, { fullName: 'asc' }],
        });
    }
}