/**
 * Utilitários para formatação de dados
 */

/**
 * Formata valor monetário para exibição
 * @param {number} value - Valor a ser formatado
 * @param {string} currency - Moeda (default: BRL)
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value, currency = 'BRL') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Formata data para exibição
 * @param {string|Date} date - Data a ser formatada
 * @param {string} locale - Locale (default: pt-BR)
 * @returns {string} Data formatada
 */
export const formatDate = (date, locale = 'pt-BR') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Formata data e hora para exibição
 * @param {string|Date} date - Data a ser formatada
 * @param {string} locale - Locale (default: pt-BR)
 * @returns {string} Data e hora formatadas
 */
export const formatDateTime = (date, locale = 'pt-BR') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Formata número para exibição
 * @param {number} value - Número a ser formatado
 * @param {number} decimals - Casas decimais (default: 0)
 * @returns {string} Número formatado
 */
export const formatNumber = (value, decimals = 0) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Converte string para slug (URL amigável)
 * @param {string} text - Texto a ser convertido
 * @returns {string} Slug gerado
 */
export const toSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
};

/**
 * Trunca texto com reticências
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitaliza primeira letra de cada palavra
 * @param {string} text - Texto a ser capitalizado
 * @returns {string} Texto capitalizado
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Remove caracteres especiais mantendo apenas números
 * @param {string} value - Valor a ser limpo
 * @returns {string} Apenas números
 */
export const onlyNumbers = (value) => {
  if (!value) return '';
  return value.toString().replace(/\D/g, '');
};

/**
 * Formata CPF/CNPJ
 * @param {string} value - Valor a ser formatado
 * @returns {string} CPF/CNPJ formatado
 */
export const formatDocument = (value) => {
  const numbers = onlyNumbers(value);
  
  if (numbers.length === 11) {
    // CPF: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value;
};

/**
 * Gera ID único simples
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  toSlug,
  truncateText,
  capitalizeWords,
  onlyNumbers,
  formatDocument,
  generateId
};
