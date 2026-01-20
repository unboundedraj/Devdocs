import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-indigo-600">
              DevDocs
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/applications" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Applications
            </Link>
            <Link 
              href="/faqs" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              FAQs
            </Link>
            <Link 
              href="/chat" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Chat
            </Link>
            <Link 
              href="/support" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Support
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              href="/support"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Contribute
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            aria-label="Menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}