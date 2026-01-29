/**
 * Empty State Component
 */

import { FileQuestion } from 'lucide-react';
import { cn } from '@/shared/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  message = 'There are no items to display.',
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300',
        className
      )}
    >
      <div className="flex justify-center mb-4">
        {icon || <FileQuestion className="h-12 w-12 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
