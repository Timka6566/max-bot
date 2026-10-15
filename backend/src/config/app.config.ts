import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './env.validation'

export const appConfig = ConfigModule.forRoot({
  isGlobal: true,
  validationSchema,
  validationOptions: {
    libraryOptions: {
      abortEarly: false,
    },
  },
});