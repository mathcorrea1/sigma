import { z } from 'zod';

/**
 * Schema de validação para produtos
 */
export const productSchema = z.object({
  nome: z
    .string()
    .min(1, 'validation.name_required')
    .min(2, 'validation.name_min_length')
    .max(100, 'validation.name_max_length')
    .trim(),
  
  descricao: z
    .string()
    .max(500, 'validation.description_max_length')
    .optional()
    .default(''),
  
  valor: z
    .number({
      required_error: 'validation.price_required',
      invalid_type_error: 'validation.price_invalid_number'
    })
    .positive('validation.price_positive')
    .max(999999.99, 'validation.price_max_value')
});

/**
 * Schema para criação de produto (conversão de string para number)
 */
export const productCreateSchema = z.object({
  nome: z
    .string()
    .min(1, 'validation.name_required')
    .min(2, 'validation.name_min_length')
    .max(100, 'validation.name_max_length')
    .trim(),
  
  descricao: z
    .string()
    .max(500, 'validation.description_max_length')
    .optional()
    .default(''),
  
  valor: z
    .string()
    .min(1, 'validation.price_required')
    .transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num)) {
        throw new Error('validation.price_invalid_number');
      }
      return num;
    })
    .refine((val) => val > 0, 'validation.price_positive')
    .refine((val) => val <= 999999.99, 'validation.price_max_value')
});

/**
 * Schema para atualização de produto
 */
export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.number().positive()
});

/**
 * Schema para filtros de produto
 */
export const productFilterSchema = z.object({
  search: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  sortBy: z.enum(['nome', 'valor', 'created_at']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export default productSchema;
