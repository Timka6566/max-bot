# 📘 MAX Bot API — Справка для фронтенда

> **Статус:** Phase 1 (MVP) — готов ✅  
> **Версия API:** `0.1.0`

---

## 📑 Содержание

- [1. Базовое](#1-базовое)
- [2. Авторизация](#2-авторизация)
- [3. Формат ответов](#3-формат-ответов)
- [4. Эндпоинты](#4-эндпоинты)
  - [Users](#users)
  - [Groups](#groups)
  - [Schedule](#schedule)
  - [Health](#health)
- [5. Сценарий запуска фронта](#5-сценарий-запуска-фронта)
- [6. Модель данных](#6-модель-данных)
- [7. Чего ещё нет](#7-чего-ещё-нет)
- [8. Быстрая проверка](#8-быстрая-проверка)

---

## 1. Базовое

| Параметр | Значение |
| :--- | :--- |
| **Base URL (dev)** | `http://localhost:3000` |
| **Префикс** | `/api` |
| **Swagger UI** | `http://localhost:3000/api/docs` |
| **Scalar Reference** | `http://localhost:3000/api/reference` |
| **CORS** | ✅ Настроен (`x-max-user-id`, `x-max-init-data` разрешены) |

Все эндпоинты работают под общим префиксом `/api`:

```http
GET http://localhost:3000/api/groups
GET http://localhost:3000/api/docs       ← Swagger UI
```

---

## 2. Авторизация

### Dev (сейчас)
Через заголовок `x-max-user-id`. **Обязателен** для пользовательских эндпоинтов и `/schedule/me`.

```http
x-max-user-id: 12345
```

### Prod (потом)
Через `x-max-init-data` — берётся из `window.WebApp.initData` в MAX Bridge.

> ⚠️ **Примечание:** Пока токена нет, просто указывай `x-max-user-id` вручную в Swagger (нажав кнопку **Authorize**) или в Postman.

---

## 3. Формат ответов

### ✅ Успех — чистый JSON без обёрток

**Объект:**
```json
{
  "id": "...",
  "fullName": "25-КС-02"
}
```

**Массив:**
```json
[
  { "id": "...", "fullName": "25-КС-02" },
  { "id": "...", "fullName": "25-КС-03" }
]
```

### ❌ Ошибка — стандартный формат NestJS

```json
{
  "statusCode": 404,
  "message": "Group not found",
  "error": "Not Found"
}
```

### Коды ошибок

| Код | Когда возникает |
|:---:|---|
| `400` | Ошибка валидации DTO |
| `401` | Не передан заголовок авторизации |
| `403` | Нет прав (например, недостаточно разрешений) |
| `404` | Ресурс не найден |
| `409` | Конфликт (например, дубликат записи) |

---

## 4. Эндпоинты

### Users

#### 🔹 `POST /api/user/me`
Точка входа при запуске Mini App. Если пользователь отсутствует — **создается** (upsert по полю `maxUserId`).

* **Auth:** ✅ Обязательна
* **Body** (все поля опциональны):
  ```typescript
  {
    firstName?: string;
    username?: string;
  }
  ```

**Логика:**
- Пользователь отсутствует → создается.
- Пользователь существует → обновляются `firstName` / `username` (если переданы новые значения).

**Response `200`:**
```typescript
{
  id: string;
  maxUserId: string;
  firstName: string | null;
  username: string | null;
  role: 'STUDENT' | 'TEACHER';
  group: GroupResponseDto | null;   // ← null, если группа не привязана
  createdAt: string;                // ISO строка
}
```

---

#### 🔹 `POST /api/user/bind-group`
Привязывает пользователя к выбранной академической группе.

* **Auth:** ✅ Обязательна
* **Body:**
  ```typescript
  {
    groupId: string; // UUID группы
  }
  ```

* **Response `200`:** Тот же объект `UserResponseDto`, но поле `group` заполнено.
* **Errors:**
  - `404` — группа с указанным `groupId` не найдена.

---

### Groups

#### 🔹 `GET /api/groups?search=`
Возвращает список академических групп. Параметр `search` опционален и производит регистронезависимый поиск по `fullName`, `specialtyCode` и `specialtyName`.

* **Auth:** ❌ Не требуется
* **Сортировка:** Сначала по `year DESC`, затем по `fullName ASC`.
* **Response `200`:** `GroupResponseDto[]`

```typescript
{
  id: string;
  fullName: string;              // "25-КС-02"
  year: string;                  // "25"
  specialtyCode: string;         // "КС"
  specialtyName: string | null;  // "Компьютерные сети"
  groupNumber: string;           // "02"
}
```

---

### Schedule

#### 🔹 `GET /api/schedule/group/:groupId`
Получение расписания для конкретной группы.

* **Auth:** ❌ Не требуется
* **Path params:**
  - `groupId` — UUID группы
* **Query params:**
  - `weekNumber?` — `1` или `2`. Если не передан, возвращается расписание на обе недели.
* **Сортировка:** Сначала по `dayOfWeek ASC`, затем по `pairNumber ASC`.
* **Response `200`:** `ScheduleResponseDto[]`

```typescript
{
  id: string;
  dayOfWeek: number;           // 1 = Пн ... 6 = Сб
  pairNumber: number;          // 1..7
  weekNumber: number;          // 1 или 2
  subject: string;
  teacherName: string | null;
  room: string | null;
}
```

* **Errors:**
  - `404` — группа не найдена.

---

#### 🔹 `GET /api/schedule/me?weekNumber=`
Получение расписания для группы текущего авторизованного пользователя.

* **Auth:** ✅ Обязательна
* **Query params:**
  - `weekNumber?` — `1` или `2`
* **Response `200`:** `ScheduleResponseDto[]`
* **Errors:**
  - `404` — пользователь не привязан к группе (`User is not bound to a group`).

---

### Health

Эндпоинты для отладки и проверки работоспособности.

#### 🔹 `GET /api/health`
```json
{
  "status": "ok",
  "timestamp": "2026-10-15T10:00:00.000Z"
}
```

#### 🔹 `GET /api/health/whoami` (auth)
```json
{
  "maxUserId": "12345"
}
```
*Удобно использовать для проверки правильности передачи авторизационного заголовка.*

---

## 5. Сценарий запуска фронта

```text
┌─────────────────────────────────────────────┐
│ 1. POST /api/user/me  (x-max-user-id)       │
│    ├─ есть group?  → ДА: показываем расписание
│    └─ нет group?   → НЕТ: показываем онбординг
│                                             │
│ 2. Онбординг:                               │
│    GET /api/groups?search= → выбор группы   │
│                                             │
│ 3. POST /api/user/bind-group { groupId }    │
│                                             │
│ 4. GET /api/schedule/me?weekNumber=1        │
└─────────────────────────────────────────────┘
```

---

## 6. Модель данных

| Сущность | Описание / Правила |
| :--- | :--- |
| `id` | Везде используется **UUID v4** |
| `Role` | `'STUDENT' \| 'TEACHER'`, значение по умолчанию — `STUDENT` |
| `group` у юзера | **Nullable**. Пока значение `null`, запросы расписания выполнять нельзя |
| `weekNumber` | Только `1` или `2` (проходит валидацию) |
| `dayOfWeek` | `1..6` (Понедельник–Суббота) |
| `pairNumber` | `1..7` |

```typescript
type Role = 'STUDENT' | 'TEACHER';
```

---

## 7. Чего ещё нет

> 🚧 Функционал в разработке, появится в следующих фазах:

- **Phase 2:** News, Teachers
- **Phase 3:** Админка (`POST/PATCH/DELETE`, загрузка xlsx, broadcast), защитный гвард `RolesGuard`
- **Prod-токен MAX** — в данный момент заменяется заголовком `x-max-user-id`

---

## 8. Быстрая проверка

### cURL

```bash
# Создание / получение пользователя
curl -X POST http://localhost:3000/api/user/me \
  -H "x-max-user-id: 12345" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Тимофей","username":"timka"}'

# Получение списка групп
curl http://localhost:3000/api/groups

# Поиск групп
curl "http://localhost:3000/api/groups?search=КС"

# Расписание конкретной группы
curl "http://localhost:3000/api/schedule/group/<groupId>?weekNumber=1"

# Расписание текущего пользователя
curl "http://localhost:3000/api/schedule/me?weekNumber=1" \
  -H "x-max-user-id: 12345"
```

### JS / TS (fetch)

```typescript
const BASE = 'http://localhost:3000/api';
const HEADERS = {
  'Content-Type': 'application/json',
  'x-max-user-id': '12345',
};

// Авторизация + апсерт пользователя
const me = await fetch(`${BASE}/user/me`, {
  method: 'POST',
  headers: HEADERS,
  body: JSON.stringify({ firstName: 'Тимофей' }),
}).then(r => r.json());

// Получение расписания
const schedule = await fetch(`${BASE}/schedule/me?weekNumber=1`, {
  headers: HEADERS,
}).then(r => r.json());
```

---

> 💡 **Совет:** Если в описании или контрактах возникают расхождения, всегда сверяйтесь со **Swagger** (`/api/docs`), так как он генерируется напрямую из декораторов кода.