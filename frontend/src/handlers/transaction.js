import api from '../services/api';
import { transactionCreateSchema } from '../schemas/transaction';

/**
 * Handler para operações de caixa/transações
 */
export class TransactionHandler {
  /**
   * Busca todas as movimentações
   */
  static async getAll() {
    try {
      const response = await api.get('/caixa');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao carregar movimentações');
    }
  }

  /**
   * Busca movimentação por ID
   */
  static async getById(id) {
    try {
      const response = await api.get(`/caixa/movimentacao/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao carregar movimentação');
    }
  }

  /**
   * Cria nova movimentação
   */
  static async create(transactionData) {
    try {
      // Valida dados com Zod
      const validatedData = transactionCreateSchema.parse(transactionData);
      
      const response = await api.post('/caixa/movimentacao', validatedData);
      return response.data;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(error.errors[0]?.message || 'Dados inválidos');
      }
      throw new Error(error.response?.data?.detail || 'Erro ao criar movimentação');
    }
  }

  /**
   * Atualiza movimentação existente
   */
  static async update(id, transactionData) {
    try {
      // Valida dados com Zod
      const validatedData = transactionCreateSchema.parse(transactionData);
      
      const response = await api.put(`/caixa/movimentacao/${id}`, validatedData);
      return response.data;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(error.errors[0]?.message || 'Dados inválidos');
      }
      throw new Error(error.response?.data?.detail || 'Erro ao atualizar movimentação');
    }
  }

  /**
   * Deleta movimentação
   */
  static async delete(id) {
    try {
      const response = await api.delete(`/caixa/movimentacao/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao excluir movimentação');
    }
  }

  /**
   * Busca resumo do caixa
   */
  static async getSummary() {
    try {
      const response = await api.get('/caixa/resumo');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao carregar resumo do caixa');
    }
  }

  /**
   * Busca movimentações com filtros
   */
  static async search(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.produto_id) params.append('produto_id', filters.produto_id);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.date_start) params.append('date_start', filters.date_start);
      if (filters.date_end) params.append('date_end', filters.date_end);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/caixa?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao buscar movimentações');
    }
  }

  /**
   * Calcula totais por período
   */
  static async getTotalsByPeriod(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
      });
      
      const response = await api.get(`/caixa/totals?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Erro ao calcular totais');
    }
  }
}

export default TransactionHandler;
