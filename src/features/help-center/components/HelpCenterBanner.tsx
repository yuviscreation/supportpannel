/**
 * Help Center Banner Component
 * Hero section for the help center page
 */

export function HelpCenterBanner() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you today?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get support for your requests, report issues, or request new
            features
          </p>
        </div>
      </div>
    </div>
  );
}
