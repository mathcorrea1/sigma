import { useEffect, useState, useRef } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const Toast = ({ notification }) => {
  const { removeNotification } = useNotification();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Focus management for screen readers
    if (isVisible && toastRef.current) {
      toastRef.current.focus();
    }
    
    // Auto-remove after duration (except for errors)
    if (notification.type !== 'error') {
      const autoRemoveTimer = setTimeout(() => {
        handleClose();
      }, notification.duration || 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(autoRemoveTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [isVisible, notification.type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeNotification(notification.id), 300);
  };

  // Get notification type for screen readers
  const getAriaLabel = () => {
    const typeLabels = {
      success: t('common.success'),
      error: t('common.error'),
      warning: t('common.warning'),
      info: t('common.info'),
    };
    return `${typeLabels[notification.type] || t('common.info')}: ${notification.title || ''} ${notification.message}`;
  };

  const icons = {
    success: (
      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    info: (
      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  };

  const colorClasses = {
    success: 'bg-white border-green-200 text-green-800',
    error: 'bg-white border-red-200 text-red-800',
    warning: 'bg-white border-amber-200 text-amber-800',
    info: 'bg-white border-blue-200 text-blue-800',
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out mb-4
        ${isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div 
        ref={toastRef}
        className={`
          max-w-sm w-full shadow-lg rounded-xl border-l-4 p-4
          ${colorClasses[notification.type]}
        `}
        role="alert"
        aria-live="assertive"
        aria-label={getAriaLabel()}
        tabIndex={-1}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[notification.type]}
          </div>
          
          <div className="ml-3 w-0 flex-1">
            {notification.title && (
              <p className="text-sm font-medium mb-1">
                {notification.title}
              </p>
            )}
            <p className="text-sm">
              {notification.message}
            </p>
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150 rounded-sm"
              aria-label={t('common.close')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const { notifications } = useNotification();
  const { t } = useTranslation();

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2"
      aria-label={t('accessibility.notifications')}
      role="region"
    >
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default ToastContainer;
