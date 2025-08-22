import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import Input from './Input';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmação',
  message = 'Tem certeza que deseja continuar?',
  type = 'warning', // 'warning', 'danger', 'info'
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  requireTyping = false,
  typingText = 'confirmar',
  loading = false,
}) => {
  const { t } = useTranslation();
  const [typedText, setTypedText] = useState('');
  const [isValid, setIsValid] = useState(!requireTyping);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && requireTyping && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, requireTyping]);

  useEffect(() => {
    if (requireTyping) {
      setIsValid(typedText.toLowerCase() === typingText.toLowerCase());
    }
  }, [typedText, typingText, requireTyping]);

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setTypedText('');
    setIsValid(!requireTyping);
    onClose();
  };

  const typeConfig = {
    warning: {
      icon: (
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      ),
      buttonVariant: 'warning',
    },
    danger: {
      icon: (
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      buttonVariant: 'danger',
    },
    info: {
      icon: (
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      buttonVariant: 'primary',
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-out">
          <div className="p-6">
            {/* Icon */}
            {typeConfig[type].icon}
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              {title}
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              {message}
            </p>
            
            {/* Typing confirmation */}
            {requireTyping && (
              <div className="mb-6">
                <Input
                  ref={inputRef}
                  label={`${t('products.type_confirm').replace('confirmar', t('common.confirm_word'))}`}
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder={typingText}
                  className={`text-center ${
                    typedText && !isValid ? 'border-red-300 focus:border-red-500' : ''
                  }`}
                />
                {typedText && !isValid && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {t('products.text_mismatch')}: {typingText}
                  </p>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                {cancelText}
              </Button>
              
              <Button
                variant={typeConfig[type].buttonVariant}
                size="lg"
                onClick={handleConfirm}
                className="flex-1"
                disabled={!isValid || loading}
                loading={loading}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
