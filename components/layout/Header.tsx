'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const handleContributeClick = () => {
    if (status === 'authenticated') {
      router.push('/contribute');
    } else {
      signIn('google', {
        callbackUrl: '/contribute',
      });
    }
  };

  return (
    <header className="bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-2xl">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative text-2xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent tracking-tight">
                DevDocs
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-900 relative group">
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link href="/applications" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-900 relative group">
              <span className="relative z-10">Applications</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link href="/faqs" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-900 relative group">
              <span className="relative z-10">FAQs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link href="/support" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-900 relative group">
              <span className="relative z-10">Support</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            {session && (
              <Link href="/chat" className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-900 relative group">
                <span className="relative z-10">AI Chat</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
            )}
          </div>

          {/* Auth & CTA Section */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all duration-200 border border-gray-700 shadow-lg"
                  >
                    <img
                      src={session.user?.image || '/default-avatar.png'}
                      alt={session.user?.name || 'User'}
                      className="w-8 h-8 rounded-full border-2 border-gray-600 shadow-lg"
                    />
                    <span className="text-white font-medium">
                      Hello, {session.user?.name?.split(' ')[0]}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl border border-gray-800 py-2 backdrop-blur-xl">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="text-sm font-medium text-white">{session.user?.name}</p>
                        <p className="text-xs text-gray-400">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950 hover:text-red-300 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                {/* Contribute (authenticated) */}
                <button
                  onClick={handleContributeClick}
                  className="bg-theme-accent text-white px-6 py-2.5 rounded-full font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-gray-700/50 transform hover:-translate-y-0.5 border border-gray-600"
                >
                  Contribute
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>

                {/* Contribute (unauthenticated) */}
                <button
                  onClick={handleContributeClick}
                  className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-2.5 rounded-full font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-gray-700/50 transform hover:-translate-y-0.5 border border-gray-600"
                >
                  Contribute
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu"
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-900 transition-colors border border-gray-800"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {showMobileMenu && (
          <div id="mobile-menu" className="md:hidden mt-2 bg-black/95 border-t border-gray-800 shadow-2xl z-40">
            <div className="px-4 py-4 space-y-2">
              <Link href="/" onClick={() => setShowMobileMenu(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium">Home</Link>
              <Link href="/applications" onClick={() => setShowMobileMenu(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium">Applications</Link>
              <Link href="/faqs" onClick={() => setShowMobileMenu(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium">FAQs</Link>
              <Link href="/support" onClick={() => setShowMobileMenu(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium">Support</Link>
              {session && (
                <Link href="/chat" onClick={() => setShowMobileMenu(false)} className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium">AI Chat</Link>
              )}

              <div className="pt-2 border-t border-gray-800">
                {status === 'loading' ? (
                  <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
                ) : session ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={session.user?.image || '/default-avatar.png'} alt={session.user?.name || 'User'} className="w-10 h-10 rounded-full border-2 border-gray-600" />
                      <div>
                        <p className="text-white font-medium">{session.user?.name}</p>
                        <p className="text-sm text-gray-400">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded">Profile</Link>
                      <button onClick={() => { setShowMobileMenu(false); signOut(); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-950 hover:text-red-300 rounded">Sign Out</button>
                    </div>
                    <button onClick={() => { setShowMobileMenu(false); handleContributeClick(); }} className="w-full mt-2 bg-theme-accent text-white px-4 py-2 rounded-full font-semibold">Contribute</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={() => { setShowMobileMenu(false); signIn('google'); }} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg font-semibold">Sign in with Google</button>
                    <button onClick={() => { setShowMobileMenu(false); handleContributeClick(); }} className="w-full bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-2 rounded-full font-semibold">Contribute</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}