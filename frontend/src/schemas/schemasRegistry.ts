import { passwordAddSchema, passwordEditSchema } from './userSchemas';

export const schemasRegistry = {
  user: {
    password_hash: {
      add: passwordAddSchema,
      edit: passwordEditSchema,
    },
  },
} as const;

export type SchemaDomain = keyof typeof schemasRegistry;