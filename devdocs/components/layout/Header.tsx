'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-theme-card backdrop-blur-md sticky top-0 z-50 border-b border-theme shadow-xl">
      <nav className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-theme-primary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative text-2xl font-bold text-theme-primary tracking-tight">
                DevDocs
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="text-theme-secondary hover:text-theme-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-theme-background"
            >
              Home
            </Link>
            <Link 
              href="/applications" 
              className="text-theme-secondary hover:text-theme-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-theme-background"
            >
              Applications
            </Link>
            <Link 
              href="/faqs" 
              className="text-theme-secondary hover:text-theme-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-theme-background"
            >
              FAQs
            </Link>
            <Link 
              href="/support" 
              className="text-theme-secondary hover:text-theme-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-theme-background"
            >
              Support
            </Link>
            {session && (
              <Link 
                href="/chat" 
                className="text-theme-secondary hover:text-theme-primary px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-theme-background"
              >
                AI Chat
              </Link>
            )}
          </div>

          {/* Auth & CTA Section */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-theme-background animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-theme-background hover:bg-theme-border transition-all duration-200 border border-theme"
                  >
                    <img 
                      src={session.user?.image || '/default-avatar.png'} 
                      alt={session.user?.name || 'User'}
                      className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] shadow-lg"
                    />
                    <span className="text-theme-primary font-medium">
                      Hello, {session.user?.name?.split(' ')[0]}
                    </span>
                    <svg className="w-4 h-4 text-theme-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-theme-card rounded-lg shadow-2xl border border-theme py-2 backdrop-blur-xl">
                      <div className="px-4 py-2 border-b border-theme">
                        <p className="text-sm font-medium text-theme-primary">{session.user?.name}</p>
                        <p className="text-xs text-theme-secondary">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-theme-secondary hover:bg-theme-background hover:text-theme-primary transition-all duration-200"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                <Link 
                  href="/contribute"
                  className="bg-theme-accent text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
                >
                  Contribute
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center gap-2 bg-theme-card border border-theme hover:bg-theme-background text-theme-primary px-6 py-2.5 rounded-lg font-semibold hover:shadow-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
                <Link 
                  href="/contribute"
                  className="bg-theme-accent text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5"
                >
                  Contribute
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-theme-secondary hover:text-theme-primary p-2 rounded-lg hover:bg-theme-background transition-colors"
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