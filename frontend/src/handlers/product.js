import api from '../services/api';
import { productCreateSchema, productUpdateSchema } from '../schemas/product';

/**
 * Handler para operações de produtos
 */
export class ProductHandler {
  /**
   * Busca todos os produtos
   */
  static async getAll() {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao carregar produtos');
    }
  }

  /**
   * Busca produto por ID
   */
  static async getById(id) {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao carregar produto');
    }
  }

  /**
   * Cria novo produto
   */
  static async create(productData) {
    try {
      // Valida dados com Zod
      const validatedData = productCreateSchema.parse(productData);
      
      const response = await api.post('/produtos', validatedData);
      return response.data;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(error.errors[0]?.message || 'Dados inválidos');
      }
      throw new Error(error.response?.data?.detail || 'Erro ao criar produto');
    }
  }

  /**
   * Atualiza produto existente
   */
  static async update(id, productData) {
    try {
      // Valida dados com Zod
      const validatedData = productCreateSchema.parse(productData);
      
      const response = await api.put(`/produtos/${id}`, validatedData);
      return response.data;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(error.errors[0]?.message || 'Dados inválidos');
      }
      throw new Error(error.response?.data?.detail || 'Erro ao atualizar produto');
    }
  }

  /**
   * Deleta produto
   */
  static async delete(id) {
    try {
      const response = await api.delete(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao excluir produto');
    }
  }

  /**
   * Busca produtos com filtros
   */
  static async search(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.sortBy) params.append('sort_by', filters.sortBy);
      if (filters.sortOrder) params.append('sort_order', filters.sortOrder);
      
      const response = await api.get(`/produtos?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao buscar produtos');
    }
  }
}

export default ProductHandler;
