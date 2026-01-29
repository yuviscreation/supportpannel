/**
 * Help Center Page - Refactored with lazy loading
 * Server component with client-only components lazy loaded
 */

import dynamic from 'next/dynamic';
import { SUPPORT_PANELS } from '@/shared/constants';

// Lazy load banner with animation
const HelpCenterBanner = dynamic(
  () =>
    import('@/features/help-center').then((mod) => ({
      default: mod.HelpCenterBanner,
    })),
  {
    ssr: true, // Can SSR since it's just content
  }
);

// Static import for support cards (lightweight)
import { SupportPanelCard } from '@/features/help-center';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <HelpCenterBanner />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-muted-foreground text-lg">
            Welcome! You can raise a request for Support using the options
            provided.
          </p>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-8">
            What can we help you with?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUPPORT_PANELS.map((panel) => (
            <SupportPanelCard key={panel.href} {...panel} />
          ))}
        </div>
      </div>
    </div>
  );
}
