import api from '../services/api';
import { loginSchema, authResponseSchema } from '../schemas/auth';

/**
 * Handler para operações de autenticação
 */
export class AuthHandler {
  /**
   * Realiza login do usuário
   */
  static async login(credentials) {
    try {
      // Valida credenciais com Zod
      const validatedCredentials = loginSchema.parse(credentials);
      
      const response = await api.post('/login', validatedCredentials);
      
      // Valida resposta da API
      const validatedResponse = authResponseSchema.parse(response.data);
      
      return validatedResponse;
    } catch (error) {
      if (error.name === 'ZodError') {
        const firstError = error.errors[0];
        throw new Error(firstError?.message || 'Dados de login inválidos');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Usuário ou senha incorretos');
      }
      
      throw new Error(error.response?.data?.detail || 'Erro ao fazer login');
    }
  }

  /**
   * Realiza logout do usuário
   */
  static async logout() {
    try {
      // Remove token do localStorage
      localStorage.removeItem('token');
      
      // Opcional: chamar endpoint de logout no servidor
      // await api.post('/logout');
      
      return { success: true };
    } catch (error) {
      // Mesmo com erro, remove o token localmente
      localStorage.removeItem('token');
      throw new Error('Erro ao fazer logout');
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  static isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Obtém o token atual
   */
  static getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Define o token de autenticação
   */
  static setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Verifica se o token está expirado (opcional)
   */
  static isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Se o token for JWT, você pode decodificar e verificar a expiração
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // return payload.exp * 1000 < Date.now();
      
      // Por enquanto, assume que não está expirado
      return false;
    } catch {
      return true;
    }
  }

  /**
   * Renova o token (se implementado no backend)
   */
  static async refreshToken() {
    try {
      const response = await api.post('/refresh-token');
      const validatedResponse = authResponseSchema.parse(response.data);
      
      this.setToken(validatedResponse.access_token);
      return validatedResponse;
    } catch (error) {
      throw new Error('Erro ao renovar token');
    }
  }
}

export default AuthHandler;
