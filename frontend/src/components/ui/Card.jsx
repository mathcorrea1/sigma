const Card = ({ 
  children, 
  className = '', 
  padding = 'lg', 
  shadow = 'md',
  hover = false,
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `
    bg-white rounded-2xl border border-gray-100
    transition-all duration-200 ease-in-out
  `;

  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:scale-[1.02] hover:border-gray-200 cursor-pointer' 
    : '';

  return (
    <div 
      className={`${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
