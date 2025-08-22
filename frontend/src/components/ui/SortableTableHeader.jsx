import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const SortableTableHeader = ({ 
  children, 
  sortKey, 
  currentSort, 
  onSort, 
  className = '',
  icon = null 
}) => {
  const handleClick = () => {
    if (onSort) {
      const newDirection = currentSort?.key === sortKey && currentSort?.direction === 'asc' ? 'desc' : 'asc';
      onSort({ key: sortKey, direction: newDirection });
    }
  };

  const getSortIcon = () => {
    if (!onSort) return null;
    
    if (currentSort?.key === sortKey) {
      return currentSort.direction === 'asc' ? (
        <ChevronUp className="h-4 w-4 ml-1" aria-hidden="true" />
      ) : (
        <ChevronDown className="h-4 w-4 ml-1" aria-hidden="true" />
      );
    }
    
    return <ChevronsUpDown className="h-4 w-4 ml-1 opacity-50" aria-hidden="true" />;
  };

  const baseClasses = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const clickableClasses = onSort ? "cursor-pointer hover:bg-gray-100 select-none" : "";

  return (
    <th
      scope="col"
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={handleClick}
      role={onSort ? "button" : undefined}
      tabIndex={onSort ? 0 : undefined}
      onKeyDown={onSort ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      aria-sort={
        currentSort?.key === sortKey 
          ? currentSort.direction === 'asc' ? 'ascending' : 'descending'
          : 'none'
      }
    >
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        {getSortIcon()}
      </div>
    </th>
  );
};

export default SortableTableHeader;
