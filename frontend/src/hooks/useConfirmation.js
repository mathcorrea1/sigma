import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useConfirmation = () => {
  const { t } = useTranslation();
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: t('common.confirm'),
    cancelText: t('common.cancel'),
    requireTyping: false,
    typingText: 'confirmar',
    onConfirm: null,
    loading: false,
  });

  const showConfirmation = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmationState({
        isOpen: true,
        title: t('common.confirm'),
        message: t('common.confirm_action'),
        type: 'warning',
        confirmText: t('common.confirm'),
        cancelText: t('common.cancel'),
        requireTyping: false,
        typingText: 'confirmar',
        loading: false,
        ...options,
        onConfirm: () => resolve(true),
      });
    });
  }, [t]);

  const hideConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const setLoading = useCallback((loading) => {
    setConfirmationState(prev => ({ ...prev, loading }));
  }, []);

  // Funções específicas
  const confirmDelete = useCallback((itemName) => {
    return showConfirmation({
      title: t('products.delete_item'),
      message: `${t('products.confirm_delete_message')} "${itemName}"? ${t('products.action_cannot_be_undone')}`,
      type: 'danger',
      confirmText: t('common.delete'),
      requireTyping: true,
      typingText: t('common.confirm_word'),
    });
  }, [showConfirmation, t]);

  const confirmUpdate = useCallback((itemName) => {
    return showConfirmation({
      title: t('products.update_item'),
      message: `${t('products.confirm_update')} "${itemName}"?`,
      type: 'warning',
      confirmText: t('common.save'),
      requireTyping: false,
    });
  }, [showConfirmation, t]);

  const confirmAction = useCallback((title, message, options = {}) => {
    return showConfirmation({
      title,
      message,
      ...options,
    });
  }, [showConfirmation]);

  return {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    setLoading,
    confirmDelete,
    confirmUpdate,
    confirmAction,
  };
};
