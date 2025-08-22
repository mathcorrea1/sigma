const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin ${sizes[size]} ${className}`}>
      <svg fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

const LoadingCard = ({ title = 'Carregando...', subtitle }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <LoadingSpinner size="xl" className="text-blue-600 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
  </div>
);

const LoadingOverlay = ({ isLoading, children }) => (
  <div className="relative">
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
        <LoadingSpinner size="lg" className="text-blue-600" />
      </div>
    )}
  </div>
);

export { LoadingSpinner, LoadingCard, LoadingOverlay };
export default LoadingSpinner;
