export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-8 h-8 border-4',
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      border-primary/30 
      border-t-primary 
      rounded-full 
      animate-spin
    `} />
  );
};
