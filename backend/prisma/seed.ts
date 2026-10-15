import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
    const group = await prisma.group.upsert({
        where: { fullName: '25-КС-02' },
        update: {},
        create: {
            fullName: '25-КС-02',
            year: '25',
            specialtyCode: 'КС',
            specialtyName: 'Компьютерные сети',
            groupNumber: '02',
        },
    });

    await prisma.schedule.deleteMany({ where: { groupId: group.id } });

    // 3. Расписание — берём фрагмент реального из фото
    const schedule = [
        // Понедельник, неделя 1
        { dayOfWeek: 1, pairNumber: 1, weekNumber: 1, subject: 'Операционные системы и среды', teacherName: 'Фисечко Р.С.', room: 'С-210Б' },
        { dayOfWeek: 1, pairNumber: 2, weekNumber: 1, subject: 'Основы электротехники и электронной техники', teacherName: 'Пилюлько Ю.Ю.', room: 'С-204Б' },
        { dayOfWeek: 1, pairNumber: 3, weekNumber: 1, subject: 'МДК.03.02 Проектирование и обеспечение функционирования программных средств КС и комплексов', teacherName: 'Фисечко Р.С.', room: 'С-204Б' },

        // Понедельник, неделя 2
        { dayOfWeek: 1, pairNumber: 2, weekNumber: 2, subject: 'История России', teacherName: 'Мачульская Ж.Б.', room: 'С-306А' },
        { dayOfWeek: 1, pairNumber: 3, weekNumber: 2, subject: 'Основы электротехники и электронной техники', teacherName: 'Пилюлько Ю.Ю.', room: 'С-204Б' },
        { dayOfWeek: 1, pairNumber: 4, weekNumber: 2, subject: 'МДК.03.01 ТО и ремонт аппаратной части КС и комплексов', teacherName: 'Фисечко Р.С.', room: 'С-204Б' },

        // Вторник, неделя 1
        { dayOfWeek: 2, pairNumber: 1, weekNumber: 1, subject: 'История России', teacherName: 'Мачульская Ж.Б.', room: 'С-306А' },
        { dayOfWeek: 2, pairNumber: 2, weekNumber: 1, subject: 'МДК.03.01 ТО и ремонт аппаратной части КС и комплексов', teacherName: 'Фисечко Р.С.', room: 'С-210Б' },
        { dayOfWeek: 2, pairNumber: 3, weekNumber: 1, subject: 'МДК.03.01 ТО и ремонт аппаратной части КС и комплексов', teacherName: 'Фисечко Р.С.', room: 'С-210Б' },

        // Среда, неделя 1
        { dayOfWeek: 3, pairNumber: 3, weekNumber: 1, subject: 'Инженерная и компьютерная графика', teacherName: 'Сергеева Е.Е.', room: 'С-214Б' },
        { dayOfWeek: 3, pairNumber: 4, weekNumber: 1, subject: 'Учебная практика', teacherName: 'Фисечко Р.С.', room: 'С-210Б' },
        { dayOfWeek: 3, pairNumber: 5, weekNumber: 1, subject: 'Учебная практика', teacherName: 'Фисечко Р.С.', room: 'С-210Б' },

        // Четверг, неделя 2
        { dayOfWeek: 4, pairNumber: 4, weekNumber: 2, subject: 'Инженерная и компьютерная графика', teacherName: 'Сергеева Е.Е.', room: 'С-214Б' },
        { dayOfWeek: 4, pairNumber: 5, weekNumber: 2, subject: 'Элементы высшей математики', teacherName: 'Хромых А.Н.', room: 'С-209Б' },
    ];

    await prisma.schedule.createMany({
    data: schedule.map((s) => ({ ...s, groupId: group.id })),
  });

  console.log(`Seeded group ${group.fullName} with ${schedule.length} schedule entries`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });