import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook simplificado para formulários com validação Zod
 */
export const useFormSimple = (schema, initialValues = {}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Atualiza valor de um campo
   */
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Atualiza múltiplos valores
   */
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  /**
   * Marca campo como tocado
   */
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  /**
   * Valida um campo específico
   */
  const validateField = useCallback((name, value) => {
    if (!schema) return true;

    try {
      // Para campos específicos, cria schema parcial
      const fieldSchema = schema.pick({ [name]: true });
      fieldSchema.parse({ [name]: value });
      
      // Remove erro se validação passou
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      
      return true;
    } catch (error) {
      if (error.errors && error.errors[0]) {
        const errorMessage = t(error.errors[0].message) || error.errors[0].message;
        setErrors(prev => ({
          ...prev,
          [name]: errorMessage
        }));
      }
      return false;
    }
  }, [schema, t, errors]);

  /**
   * Valida todo o formulário
   */
  const validate = useCallback(() => {
    if (!schema) return true;

    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach(err => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0];
            const errorMessage = t(err.message) || err.message;
            newErrors[fieldName] = errorMessage;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, values, t]);

  /**
   * Manipula mudança de campo
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Para campos numéricos, permite apenas números e pontos decimais
    if (type === 'number' && typeof value === 'string') {
      // Remove caracteres não numéricos exceto ponto e vírgula
      newValue = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    }
    
    setValue(name, newValue);
    
    // Valida campo em tempo real se já foi tocado
    if (touched[name]) {
      setTimeout(() => validateField(name, newValue), 0);
    }
  }, [setValue, validateField, touched]);

  /**
   * Manipula blur do campo
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setFieldTouched(name, true);
    setTimeout(() => validateField(name, value), 0);
  }, [setFieldTouched, validateField]);

  /**
   * Manipula submit do formulário
   */
  const createSubmitHandler = useCallback((onSubmitCallback) => {
    return async (e) => {
      if (e) e.preventDefault();

      // Marca todos os campos como tocados
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Valida formulário
      if (!validate()) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (onSubmitCallback) {
          await onSubmitCallback(values);
        }
      } catch (error) {
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validate]);

  /**
   * Reseta o formulário
   */
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Define erros externos (ex: vindos do servidor)
   */
  const setFieldErrors = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, []);

  return {
    // Estados
    values,
    errors,
    touched,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,

    // Funções de controle
    setValue,
    setFormValues,
    setFieldTouched,
    setFieldErrors,
    reset,

    // Funções de validação
    validate,
    validateField,

    // Handlers
    handleChange,
    handleBlur,
    createSubmitHandler
  };
};

export default useFormSimple;