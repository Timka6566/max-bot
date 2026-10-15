import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BindGroupDto } from './dto/bind-group.dto';

const groupSelect = {
    id: true,
    fullName: true,
    year: true,
    specialtyCode: true,
    specialtyName: true,
    groupNumber: true
}

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertMe(maxUserId: string) {
        return this.prisma.user.upsert({
            where: { maxUserId },
            update: {},
            create: { maxUserId },
            include: { group: { select: groupSelect } }
        })
    }

    async bindGroup(maxUserId: string, dto: BindGroupDto) {
        const group = await this.prisma.group.findUnique({
            where: { id: dto.groupId }
        })

        if (!group) throw new NotFoundException(`Group ${dto.groupId} not found`);

        return this.prisma.user.update({
            where: { maxUserId },
            data: { groupId: dto.groupId },
            include: { group: { select: groupSelect } }
        })
    }
}
