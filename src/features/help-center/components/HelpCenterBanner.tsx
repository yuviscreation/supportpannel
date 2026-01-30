/**
 * Help Center Banner Component
 * Hero section for the help center page
 */

export function HelpCenterBanner() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 py-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 leading-tight text-center">
            Welcome to the Shipskart Technical Help Center
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Get support for your requests, report issues, or request new
            features
          </p>
        </div>
      </div>
    </div>
  );
}
