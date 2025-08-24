import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },
};

// Products API
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

// Caixa API
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
