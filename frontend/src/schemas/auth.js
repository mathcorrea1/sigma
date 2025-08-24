import { z } from 'zod';

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'validation.username_required')
    .min(3, 'validation.username_min_length')
    .max(50, 'validation.username_max_length')
    .trim(),
  
  password: z
    .string()
    .min(1, 'validation.password_required')
    .min(6, 'validation.password_min_length')
    .max(100, 'validation.password_max_length')
});

/**
 * Schema para resposta de autenticação
 */
export const authResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string().default('bearer'),
  expires_in: z.number().optional()
});

export default loginSchema;
