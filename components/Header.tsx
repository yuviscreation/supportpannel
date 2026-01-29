import Link from "next/link";
import { Home } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          <Link href="/">
            <img src="/images/shipskart-logo.png" alt="Shipskart" className="h-10 w-auto" />
          </Link>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/" aria-label="Home" className="inline-flex items-center justify-center h-10 w-10 rounded-md text-gray-600 hover:bg-gray-100">
              <Home className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
