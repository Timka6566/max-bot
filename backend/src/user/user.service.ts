import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BindGroupDto } from './dto/bind-group.dto';
import { UpsertMeDto } from './dto/upsert-me.dto';

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

    async upsertMe(maxUserId: string, dto: UpsertMeDto = {}) {
        return this.prisma.user.upsert({
            where: { maxUserId },
            update: {
                ...(dto.firstName !== undefined && { firstName: dto.firstName }),
                ...(dto.username !== undefined && { username: dto.username }),
            },
            create: {
                maxUserId,
                firstName: dto.firstName ?? null,
                username: dto.username ?? null,
            },
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

    async findGroupIdByMaxUserId(maxUserId: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { maxUserId },
            select: { groupId: true },
        });

        if (!user?.groupId) {
            throw new NotFoundException('User is not bound to a group');
        }

        return user.groupId;
    }
}