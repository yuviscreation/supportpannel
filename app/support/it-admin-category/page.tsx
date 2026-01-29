/**
 * IT Admin Category Page - Refactored
 */

import { SupportPanelCard } from '@/features/help-center';
import { IT_ADMIN_OPTIONS } from '@/shared/constants';

export default function ITAdminCategoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            IT Admin / Data Correction Requests
          </h1>
          <p className="text-muted-foreground text-lg">
            Select an option below to proceed with your request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {IT_ADMIN_OPTIONS.map((option) => (
            <SupportPanelCard key={option.href} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
}
