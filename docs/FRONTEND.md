1. Быстрый старт:
```bash
cd frontend
yarn create vite . --template react-ts
yarn install
```

В package.json зафиксируй React 18:
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1"
  }
}
```

Установи зависимости:
```bash
yarn add react-router-dom @dementevdev/max-ui max-bridge
yarn install
```

Настрой прокси, что бы CORS не выебывался:
в файле vite.config.ts:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

В коде пиши запросы с **относительным** путем:
```ts
fetch('/api/groups')  // правильно — пойдёт через прокси
fetch('http://localhost:3000/api/groups')  //  неправильно — упрётся в CORS
```

### ПОЛЕЗНЫЕ КОМАНДЫ
```bash
# Запуск фронта
cd frontend && yarn dev

# Проверка API в браузере (после запуска фронта)
http://localhost:5173/api/groups   # должно вернуть список групп через прокси

# Swagger бэкенда
http://localhost:3000/api/docs
```

Это база, дальше уже сам там, если че - пиши.