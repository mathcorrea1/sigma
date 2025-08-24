import { z } from 'zod';

/**
 * Schema de validação para movimentações de caixa
 */
export const transactionSchema = z.object({
  produto_id: z
    .number({
      required_error: 'validation.product_required',
      invalid_type_error: 'validation.product_invalid'
    })
    .positive('validation.product_invalid'),
  
  tipo: z
    .enum(['entrada', 'saida'], {
      required_error: 'validation.type_required',
      invalid_type_error: 'validation.type_invalid'
    }),
  
  quantidade: z
    .number({
      required_error: 'validation.quantity_required',
      invalid_type_error: 'validation.quantity_invalid'
    })
    .positive('validation.quantity_positive')
    .int('validation.quantity_integer'),
  
  valor_unitario: z
    .number({
      required_error: 'validation.unit_price_required',
      invalid_type_error: 'validation.unit_price_invalid'
    })
    .positive('validation.unit_price_positive'),
  
  observacao: z
    .string()
    .max(255, 'validation.observation_max_length')
    .optional()
    .default('')
});

/**
 * Schema para criação de transação (conversão de strings)
 */
export const transactionCreateSchema = z.object({
  produto_id: z
    .string()
    .min(1, 'validation.product_required')
    .transform((val) => {
      const num = parseInt(val);
      if (isNaN(num)) {
        throw new Error('validation.product_invalid');
      }
      return num;
    }),
  
  tipo: z
    .enum(['entrada', 'saida'], {
      required_error: 'validation.type_required'
    }),
  
  quantidade: z
    .string()
    .min(1, 'validation.quantity_required')
    .transform((val) => {
      const num = parseInt(val);
      if (isNaN(num)) {
        throw new Error('validation.quantity_invalid');
      }
      return num;
    })
    .refine((val) => val > 0, 'validation.quantity_positive'),
  
  valor_unitario: z
    .string()
    .min(1, 'validation.unit_price_required')
    .transform((val) => {
      const num = parseFloat(val);
      if (isNaN(num)) {
        throw new Error('validation.unit_price_invalid');
      }
      return num;
    })
    .refine((val) => val > 0, 'validation.unit_price_positive'),
  
  observacao: z
    .string()
    .max(255, 'validation.observation_max_length')
    .optional()
    .default('')
});

/**
 * Schema para filtros de transação
 */
export const transactionFilterSchema = z.object({
  produto_id: z.number().positive().optional(),
  tipo: z.enum(['entrada', 'saida']).optional(),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
  search: z.string().optional()
});

export default transactionSchema;
