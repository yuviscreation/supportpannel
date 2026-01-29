/**
 * Loading Spinner Component
 */

import { RefreshCw } from 'lucide-react';
import { cn } from '@/shared/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({
  size = 'md',
  message,
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <RefreshCw
        className={cn(
          'animate-spin text-gray-400',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-gray-600 mt-3 text-sm">{message}</p>
      )}
    </div>
  );
}
