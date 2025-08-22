import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  placeholder, 
  value, 
  onChange, 
  onClear,
  className = '',
  disabled = false 
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search 
            className={`h-5 w-5 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}
            aria-hidden="true"
          />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder || t('common.search')}
          className={`
            block w-full pl-10 pr-10 py-3 text-sm 
            bg-white border border-gray-300 rounded-xl
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            transition-all duration-200 ease-in-out
            ${isFocused ? 'shadow-lg' : 'hover:border-gray-400'}
          `}
          aria-label={placeholder || t('accessibility.search')}
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none focus:text-gray-600"
            aria-label={t('common.clear')}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
