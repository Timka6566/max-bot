# API Contract - MAX Bot

**Версия:** 0.1.0
**Статус:** Phase 1 (in progress)


## Конвенции

### Base Url

Окружение: 
    Dev: `http://localhost:3000`
    Prod: TBD

### Префикс

Все эндпоинты - под `/api`. Swagger UI - на `api/docs`.

```
GET http://localhost:3000/api/groups
GET http://localhost:3000/api/docs      <- Swagger UI
```

### Аутентификация
    Dev: `x-max-user-id: 12345` Пока нет токена MAX. Вручную вбиваешь в Swagger
    Prod: `x-max-init-data: <initData>` Когда придет токен. MAX Bridge отдает `window.WebApp.initData`.

# Формат ответа

**Упех** - голый JSON, без обертки:
```json
{ "id": "...", "fullName": "25-KC-02" }
```

```json
[
    { "id": "...", "fullName": "25-KC-02" },
    { "id": "...", "fullName": "25-KC-03" }

]

**Ошибка** - стандартный NestJS-формат:

```json
{
    "statusCode": 404,
    "message": "Group not found",
    "error": "Not Found"
}
```

### Коды ошибок

`400` - Ошибка валидации DTO
`401` - Не передан заголовок авторизации
`403` - Нет прав (например, не админ)
`404` - Ресур не найден
`409` - Конфликт (например, дубликат)

### Тип данных `Role`

```typescript
type Role = 'STUDENT' | 'TEACHER';
```
### Индетификаторы 

Все id - `uuid` (v4)

## Phase 1 - MVP

### Users

#### `POST /api/user/me`

Возвращает профиль текущего пользователя. Если пользователя нет — **создаёт его** (upsert по `maxUserId`). Точка входа для фронтенда при запуске Mini App.

**Auth:** обязательна

**Body:** отсутствует

**Response `200`:**

```typescript
{
  id: string;
  maxUserId: string;
  firstName: string | null;
  username: string | null;
  role: Role;
  group: {
    id: string;
    fullName: string;
    year: string;
    specialtyCode: string;
    specialtyName: string | null;
    groupNumber: string;
  } | null;
  createdAt: string; 
}
```

**Пример:**

```json
{
  "id": "5b1c...uuid",
  "maxUserId": "12345",
  "firstName": "Тимофей",
  "username": "timka",
  "role": "STUDENT",
  "group": null,
  "createdAt": "2026-10-15T10:00:00.000Z"
}
```


#### `POST /api/user/bind-group`

Привязывает пользователя к группе.

**Auth:** обязательна

**Body:**

```typescript
{
  groupId: string;  // uuid
}
```

**Response `200`:** тот же `UserResponseDto`, но `group` заполнен.

**Errors:**
- `404` — группа с таким `groupId` не найдена
### Groups

#### `GET /api/groups`

Возвращает список всех групп.

**Auth:** не требуется

**Response `200`:** `GroupResponseDto[]`

```typescript
{
  id: string;
  fullName: string;         // "25-КС-02"
  year: string;             // "25"
  specialtyCode: string;    // "КС"
  specialtyName: string | null;  // "Компьютерные сети"
  groupNumber: string;      // "02"
}
```

**Сортировка:** `year DESC`, затем `fullName ASC`.


### Schedule

#### `GET /api/schedule/group/:groupId`

**Сценарий использования на фронте:**

1. `POST /api/user/me` → получаем профиль. Если юзера не было — он создан.
2. Если `group === null` → показываем онбординг, `/schedule` не трогаем.
3. Если `group !== null` → `GET /api/schedule/group/{group.id}`.

Расписание конкретной группы.

**Auth:** не требуется

**Path params:**
- `groupId` — uuid группы

**Query params:**
- `weekNumber?` — `1` или `2`. Если не передан — возвращается расписание обеих недель.

**Response `200`:** `ScheduleResponseDto[]`

```typescript
{
  id: string;
  dayOfWeek: number;        // 1 = Пн ... 6 = Сб
  pairNumber: number;       // 1..7
  weekNumber: number;       // 1 или 2
  subject: string;
  teacherName: string | null;
  room: string | null;
}
```
**Сортировка:** `dayOfWeek ASC`, затем `pairNumber ASC`.

**Errors:**
- `404` — группа не найдена

#### `GET /api/schedule/me`

Расписание для группы текущего пользователя.

**Auth:** обязательна

**Query params:**
- `weekNumber?` — `1` или `2`

**Response `200`:** `ScheduleResponseDto[]`

**Errors:**
- `404` — пользователь не привязан к группе

## Phase 2 - Контент (в планах)

Сразу зафиксировать формат, что бы не переделывать модель.

### News

- `GET /api/news?page=1&limit=10` → `{ items: News[], total, page, limit }`
- `GET /api/news/:id` → `News`


```typescript
// News
{
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: string;   
}
```

### Teachers

- `GET /api/teachers?search=` → `Teacher[]`
- `GET /api/teachers/:id` → `Teacher`

```typescript
// Teacher
{
  id: string;
  fullName: string;
  department: string | null;
  subjects: string[];
  photoUrl: string | null;
}
```

## Phase 3 - Админка (в планах)

Все эндпоинты требуют роль `TEACHER` или выше (гвард `RolesGuard`).

- `POST /api/news` — body: `CreateNewsDto`
- `PATCH /api/news/:id`
- `DELETE /api/news/:id`
- `POST /api/admin/schedule/upload` — `multipart/form-data`, поле `file` (xlsx/csv)
- `POST /api/admin/broadcast` — body: `{ message: string, groupId?: string }`

## TODO для бэкенда 

- [OK] В `main.ts` добавить `app.setGlobalPrefix('api')`
- [ ] Перенести Swagger на `/api/docs` (`SwaggerModule.setup('api/docs', ...)`)
- [ ] Создать `MaxAuthGuard` (пока читает `x-max-user-id`, позже — `x-max-init-data`)
- [ ] Создать `@MaxUserId()` параметр-декоратор
- [ ] Создать `UsersModule` с `POST /user/me` и `POST /user/bind-group`
- [ ] Добавить `search` в `GET /groups`
- [ ] Убрать `/` роут из `AppController` (или оставить как healthcheck?) 