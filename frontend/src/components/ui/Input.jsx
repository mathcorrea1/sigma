import { forwardRef, useState, useId } from 'react';
import { useTranslation } from 'react-i18next';

const Input = forwardRef(({ 
  label, 
  error, 
  helperText,
  icon,
  type = 'text',
  className = '',
  required = false,
  'aria-describedby': ariaDescribedby,
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  // Combine describedby IDs
  const describedBy = [
    error && errorId,
    helperText && !error && helperId,
    ariaDescribedby
  ].filter(Boolean).join(' ') || undefined;

  const baseClasses = `
    w-full px-4 py-3 text-sm bg-white border rounded-xl
    transition-all duration-200 ease-in-out
    placeholder:text-gray-400
    focus:outline-none focus:ring-4 focus:ring-blue-500/20
    disabled:bg-gray-50 disabled:cursor-not-allowed
  `;

  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 text-red-900'
    : focused 
      ? 'border-blue-500 shadow-lg'
      : 'border-gray-200 hover:border-gray-300';

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span 
              className="text-red-500 ml-1" 
              aria-label={t('accessibility.required_field')}
            >
              *
            </span>
          )}
          {!required && (
            <span className="text-gray-400 ml-1 text-xs">
              ({t('accessibility.optional_field')})
            </span>
          )}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          type={type}
          className={`${baseClasses} ${stateClasses} ${icon ? 'pl-10' : ''} ${className}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          {...props}
        />
      </div>
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={helperId}
          className="text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
