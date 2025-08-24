import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook personalizado para tratamento centralizado de erros
 * @returns {Object} Funções para tratamento de diferentes tipos de erro
 */
export const useErrorHandler = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotification();

  /**
   * Trata erros de validação de formulário
   * @param {Error} error - Erro capturado
   * @param {Function} setErrors - Função para definir erros no estado
   */
  const handleFormError = (error, setErrors) => {
    if (error.response?.status === 400) {
      const detail = error.response.data?.detail;
      
      if (Array.isArray(detail)) {
        // Erros de validação do FastAPI
        const formErrors = {};
        detail.forEach(err => {
          if (err.loc && err.loc.length > 1) {
            const field = err.loc[1];
            const message = getFieldErrorMessage(field, err.type, err.msg);
            formErrors[field] = message;
          }
        });
        setErrors(formErrors);
        return;
      }
      
      if (typeof detail === 'string') {
        // Erro de validação personalizada
        setErrors({ general: detail });
        return;
      }
    }
    
    // Erro geral
    const message = error.message || t('errors.generic');
    setErrors({ general: message });
    showNotification(message, 'error');
  };

  /**
   * Trata erros de API (sem formulário)
   * @param {Error} error - Erro capturado
   * @param {string} defaultMessage - Mensagem padrão se não houver específica
   */
  const handleApiError = (error, defaultMessage = null) => {
    let message = defaultMessage || t('errors.generic');
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = error.response.data?.detail || t('validation.invalid_request');
          break;
        case 401:
          message = t('validation.unauthorized_error');
          break;
        case 403:
          message = t('errors.forbidden');
          break;
        case 404:
          message = t('errors.not_found');
          break;
        case 500:
          message = t('errors.server_error');
          break;
        default:
          message = error.response.data?.detail || error.response.data?.message || message;
      }
    } else if (error.code === 'NETWORK_ERROR') {
      message = t('validation.network_error');
    }
    
    showNotification(message, 'error');
    return message;
  };

  /**
   * Retorna mensagem de erro específica para campo
   * @param {string} field - Nome do campo
   * @param {string} type - Tipo do erro
   * @param {string} defaultMsg - Mensagem padrão
   */
  const getFieldErrorMessage = (field, type, defaultMsg) => {
    const fieldTranslations = {
      nome: 'name',
      valor: 'price',
      descricao: 'description',
      quantidade: 'quantity',
      username: 'username',
      password: 'password'
    };

    const errorTypes = {
      'missing': 'required',
      'value_error': 'invalid',
      'type_error': 'invalid_type'
    };

    const translatedField = fieldTranslations[field] || field;
    const translatedType = errorTypes[type] || 'invalid';
    
    const key = `validation.${translatedField}_${translatedType}`;
    
    // Tenta buscar tradução específica, se não existir usa a padrão
    const translatedMessage = t(key);
    if (translatedMessage !== key) {
      return translatedMessage;
    }
    
    // Fallback para mensagens genéricas
    if (type === 'missing') {
      return t(`validation.${translatedField}_required`);
    }
    
    return defaultMsg || t('validation.server_error');
  };

  /**
   * Trata erros de operações específicas
   * @param {Error} error - Erro capturado
   * @param {string} operation - Tipo de operação (create, update, delete)
   * @param {string} entity - Entidade (product, transaction)
   */
  const handleOperationError = (error, operation, entity = 'item') => {
    const operationMessages = {
      create: t(`errors.${entity}_create_failed`),
      update: t(`errors.${entity}_update_failed`),
      delete: t(`errors.${entity}_delete_failed`),
      fetch: t(`errors.${entity}_fetch_failed`)
    };

    const defaultMessage = operationMessages[operation] || t('errors.operation_failed');
    return handleApiError(error, defaultMessage);
  };

  return {
    handleFormError,
    handleApiError,
    handleOperationError,
    getFieldErrorMessage
  };
};

export default useErrorHandler;
