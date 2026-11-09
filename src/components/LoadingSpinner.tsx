'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  opacity?: number;
  withSpacing?: boolean;
}

export function LoadingSpinner({ size = 'md', className = '', opacity = 1, withSpacing = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-gray-200 border-r-transparent align-middle motion-reduce:animate-[spin_0.75s_linear_infinite] ${withSpacing ? 'ml-2' : ''} ${sizeClasses[size]} ${className}`}
      style={{
        borderTopColor: '#0E68DC',
        opacity,
      }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
