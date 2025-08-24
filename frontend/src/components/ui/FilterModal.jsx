import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, X, ChevronDown } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onClearFilters,
  filters = {},
  filterOptions = {} 
}) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (filterName, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    onClose();
  };

  const renderFilterOption = (key, option) => {
    switch (option.type) {
      case 'select':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {option.label}
            </label>
            <div className="relative">
              <select
                value={localFilters[key] || ''}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">{t('forms.select_placeholder')}</option>
                {option.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {option.label}
            </label>
            <input
              type="date"
              value={localFilters[key] || ''}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'dateRange':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {option.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                placeholder={t('forms.start_date')}
                value={localFilters[key]?.start || ''}
                onChange={(e) => handleFilterChange(key, { 
                  ...localFilters[key], 
                  start: e.target.value 
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                placeholder={t('forms.end_date')}
                value={localFilters[key]?.end || ''}
                onChange={(e) => handleFilterChange(key, { 
                  ...localFilters[key], 
                  end: e.target.value 
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'range':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {option.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={t('forms.min_value')}
                value={localFilters[key]?.min || ''}
                onChange={(e) => handleFilterChange(key, { 
                  ...localFilters[key], 
                  min: e.target.value 
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder={t('forms.max_value')}
                value={localFilters[key]?.max || ''}
                onChange={(e) => handleFilterChange(key, { 
                  ...localFilters[key], 
                  max: e.target.value 
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" aria-hidden="true" />
          {t('common.filters')}
        </div>
      }
      size="md"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(filterOptions).map(([key, option]) => 
            renderFilterOption(key, option)
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
          >
            {t('common.clear_filters')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleApply}
          >
            <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
            {t('common.apply')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
