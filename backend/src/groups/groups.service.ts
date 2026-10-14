import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findAll() {
        return this.prisma.group.findMany({
            orderBy: [{ year: 'desc' }, { fullName: 'asc' }]
        })
    }
}
