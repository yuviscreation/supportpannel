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

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="mb-14 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <p className="text-gray-600 text-base leading-relaxed">
            Welcome! You can raise a request for Support using the options
            provided.
          </p>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">
            What can we help you with?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SUPPORT_PANELS.map((panel, idx) => (
            <div
              key={panel.href}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{
                animationDelay: `${(idx + 2) * 100}ms`,
                animationFillMode: 'both',
              }}
            >
              <SupportPanelCard {...panel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
