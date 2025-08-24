import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook personalizado para gerenciar formulários com validação Zod
 * @param {Object} options - Opções do hook
 * @param {Object} options.schema - Schema Zod para validação
 * @param {Object} options.initialValues - Valores iniciais do formulário
 * @param {Function} options.onSubmit - Função chamada no submit
 * @returns {Object} Estado e funções do formulário
 */
export const useForm = ({
  schema,
  initialValues = {},
  onSubmit = () => {}
}) => {
  const { t } = useTranslation();
  const [values, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Atualiza valor de um campo
   */
  const setValue = useCallback((name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  /**
   * Atualiza múltiplos valores
   */
  const setValues = useCallback((newValues) => {
    setFormValues(prev => ({
      ...prev,
      ...newValues
    }));
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
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
      
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
  }, [schema, t]);

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
    const newValue = type === 'checkbox' ? checked : value;
    
    setValue(name, newValue);
    
    // Valida campo em tempo real se já foi tocado
    if (touched[name]) {
      validateField(name, newValue);
    }
  }, [setValue, validateField, touched]);

  /**
   * Manipula blur do campo
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setFieldTouched(name, true);
    validateField(name, value);
  }, [setFieldTouched, validateField]);

  /**
   * Manipula submit do formulário
   */
  const handleSubmit = useCallback(async (e) => {
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
      await onSubmit(values);
    } catch (error) {
      // Tratamento de erro será feito no componente
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  /**
   * Reseta o formulário
   */
  const reset = useCallback((newInitialValues = initialValues) => {
    setFormValues(newInitialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Define erros externos (ex: vindos do servidor)
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  /**
   * Define múltiplos erros
   */
  const setFieldErrors = useCallback((newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  }, []);

  /**
   * Verifica se campo tem erro
   */
  const hasError = useCallback((name) => {
    return !!errors[name] && touched[name];
  }, [errors, touched]);

  /**
   * Verifica se formulário é válido
   */
  const isValid = Object.keys(errors).length === 0;

  /**
   * Verifica se formulário foi modificado
   */
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    // Valores
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,

    // Funções de controle
    setValue,
    setValues,
    setFieldTouched,
    setFieldError,
    setFieldErrors,
    reset,

    // Funções de validação
    validate,
    validateField,
    hasError,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Utilitários
    getFieldProps: (name) => ({
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: hasError(name) ? errors[name] : undefined
    })
  };
};

export default useForm;
