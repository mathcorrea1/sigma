import axios from 'axios';

// Função helper para obter variáveis de ambiente de forma segura
const getEnvVar = (key, defaultValue) => {
  try {
    // Tenta import.meta.env (Vite)
    if (import.meta && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
    // Fallback para window.__ENV__ se definido
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
      return window.__ENV__[key];
    }
    // Fallback final
    return defaultValue;
  } catch (error) {
    console.warn(`Erro ao acessar variável de ambiente ${key}:`, error);
    return defaultValue;
  }
};

const API_BASE_URL = getEnvVar('VITE_API_URL', 'http://localhost:8000');

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erro de autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Sessão expirada. Faça login novamente.'));
    }
    
    // Erro de validação (400)
    if (error.response?.status === 400) {
      const detail = error.response.data?.detail;
      if (detail) {
        // Manter o erro original para tratamento específico no componente
        return Promise.reject(error);
      }
    }
    
    // Erro de rede
    if (!error.response) {
      return Promise.reject(new Error('Erro de conexão. Verifique sua internet.'));
    }
    
    // Outros erros do servidor
    const serverMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         `Erro ${error.response?.status}: ${error.response?.statusText}`;
    
    return Promise.reject(new Error(serverMessage));
  }
);

// Legacy exports (manter compatibilidade)
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },
};

export const productsAPI = {
  getAll: async () => {
    const response = await api.get('/produtos');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },
  
  create: async (product) => {
    const response = await api.post('/produtos', product);
    return response.data;
  },
  
  update: async (id, product) => {
    const response = await api.put(`/produtos/${id}`, product);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },
};

export const caixaAPI = {
  getMovimentacoes: async () => {
    const response = await api.get('/caixa');
    return response.data;
  },
  
  createMovimentacao: async (movimentacao) => {
    const response = await api.post('/caixa/movimentacao', movimentacao);
    return response.data;
  },
  
  updateMovimentacao: async (id, movimentacao) => {
    const response = await api.put(`/caixa/movimentacao/${id}`, movimentacao);
    return response.data;
  },
  
  deleteMovimentacao: async (id) => {
    const response = await api.delete(`/caixa/movimentacao/${id}`);
    return response.data;
  },
};

export default api;
