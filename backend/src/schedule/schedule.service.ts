import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ScheduleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) { }

    async findByGroup(groupId: string, weekNumber?: number) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId }
        })

        if (!group) throw new NotFoundException(`Group ${groupId} not found`)

        return this.prisma.schedule.findMany({
            where: {
                groupId,
                ...(weekNumber && { weekNumber }),
            },
            orderBy: [{ dayOfWeek: 'asc' }, { pairNumber: 'asc' }],
            select: {
                id: true,
                dayOfWeek: true,
                pairNumber: true,
                weekNumber: true,
                subject: true,
                teacherName: true,
                room: true,
            }
        })
    }

    async findByUser(maxUserId: string, weekNumber?: number) {
        const groupId = await this.userService.findGroupIdByMaxUserId(maxUserId)
        return this.findByGroup(groupId, weekNumber)
    }
}
