import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BindGroupDto } from './dto/bind-group.dto';

const userSelect = {
    id: true,
    maxUserId: true,
    firstName: true,
    username: true,
    role: true,
    createdAt: true,
    group: {
        select: {
            id: true,
            fullName: true,
            year: true,
            specialtyCode: true,
            specialtyName: true,
            groupNumber: true,
        },
    },
};

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertMe(maxUserId: string) {
        return this.prisma.user.upsert({
            where: { maxUserId },
            update: {},
            create: { maxUserId },
            select: userSelect,
        });
    }

    async bindGroup(maxUserId: string, dto: BindGroupDto) {
        const group = await this.prisma.group.findUnique({
            where: { id: dto.groupId },
        });

        if (!group) {
            throw new NotFoundException(`Group ${dto.groupId} not found`);
        }

        return this.prisma.user.upsert({
            where: { maxUserId },
            update: { groupId: dto.groupId },
            create: { maxUserId, groupId: dto.groupId },
            select: userSelect,
        });
    }
}