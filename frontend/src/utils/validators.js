/**
 * Utilitários para validação de dados
 */

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCPF = (cpf) => {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let digit1 = (sum * 10) % 11;
  if (digit1 === 10) digit1 = 0;
  
  if (digit1 !== parseInt(numbers[9])) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  let digit2 = (sum * 10) % 11;
  if (digit2 === 10) digit2 = 0;
  
  return digit2 === parseInt(numbers[10]);
};

/**
 * Valida CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} True se válido
 */
export const isValidCNPJ = (cnpj) => {
  // Remove caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Valida primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weights1[i];
  }
  let digit1 = sum % 11;
  digit1 = digit1 < 2 ? 0 : 11 - digit1;
  
  if (digit1 !== parseInt(numbers[12])) return false;
  
  // Valida segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weights2[i];
  }
  let digit2 = sum % 11;
  digit2 = digit2 < 2 ? 0 : 11 - digit2;
  
  return digit2 === parseInt(numbers[13]);
};

/**
 * Valida se string contém apenas números
 * @param {string} value - Valor a ser validado
 * @returns {boolean} True se contém apenas números
 */
export const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

/**
 * Valida se string contém apenas números com decimais
 * @param {string} value - Valor a ser validado
 * @returns {boolean} True se é número decimal válido
 */
export const isDecimal = (value) => {
  return /^\d+(\.\d+)?$/.test(value);
};

/**
 * Valida se valor está dentro de um range
 * @param {number} value - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True se está no range
 */
export const isInRange = (value, min, max) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Valida se string tem tamanho mínimo
 * @param {string} value - Valor a ser validado
 * @param {number} minLength - Tamanho mínimo
 * @returns {boolean} True se atende o mínimo
 */
export const hasMinLength = (value, minLength) => {
  return typeof value === 'string' && value.length >= minLength;
};

/**
 * Valida se string tem tamanho máximo
 * @param {string} value - Valor a ser validado
 * @param {number} maxLength - Tamanho máximo
 * @returns {boolean} True se não excede o máximo
 */
export const hasMaxLength = (value, maxLength) => {
  return typeof value === 'string' && value.length <= maxLength;
};

/**
 * Valida URL
 * @param {string} url - URL a ser validada
 * @returns {boolean} True se é URL válida
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida se valor é uma data válida
 * @param {string|Date} date - Data a ser validada
 * @returns {boolean} True se é data válida
 */
export const isValidDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Valida senha forte
 * @param {string} password - Senha a ser validada
 * @returns {object} Resultado da validação com detalhes
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: []
  };
  
  if (!password || password.length < 8) {
    result.isValid = false;
    result.errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve ter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve ter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve ter pelo menos um número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.isValid = false;
    result.errors.push('Senha deve ter pelo menos um caractere especial');
  }
  
  return result;
};

export default {
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  isNumeric,
  isDecimal,
  isInRange,
  hasMinLength,
  hasMaxLength,
  isValidURL,
  isValidDate,
  validatePassword
};
