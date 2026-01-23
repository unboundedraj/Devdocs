import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-theme-card text-theme-secondary py-16 px-6 border-t border-theme">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-theme-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <h3 className="text-2xl font-bold text-theme-primary">
                DevDocs
              </h3>
            </div>
            <p className="text-theme-secondary leading-relaxed">
              A centralized hub for developer documentation. 
              Making it easier to find and contribute documentation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-theme-primary font-semibold mb-6 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-theme-secondary hover:text-theme-accent transition-colors duration-200 font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/applications" 
                  className="text-theme-secondary hover:text-theme-accent transition-colors duration-200 font-medium"
                >
                  Applications
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-theme-secondary hover:text-theme-accent transition-colors duration-200 font-medium"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-theme-primary font-semibold mb-6 text-sm uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="text-theme-secondary hover:text-theme-accent transition-colors duration-200 font-medium"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-theme-secondary hover:text-theme-accent transition-colors duration-200 font-medium"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-theme-secondary hover:text-theme-accent transition-colors duration-200 font-medium"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-theme pt-8 text-center text-theme-secondary">
          <p>&copy; {new Date().getFullYear()} DevDocs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}