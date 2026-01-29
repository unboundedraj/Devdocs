import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold">D</span>
            </div>
            <span className="text-white font-semibold">DevDocs</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/applications" className="text-gray-400 hover:text-white transition-colors">
              Applications
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DevDocs
          </div>
        </div>
      </div>
    </footer>
  );
}