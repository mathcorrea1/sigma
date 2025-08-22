import Button from './Button';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="mb-6">
        {icon || defaultIcon}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || 'Nenhum item encontrado'}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        {description || 'Não há dados para exibir no momento.'}
      </p>
      
      {action && action}
    </div>
  );
};

export default EmptyState;
