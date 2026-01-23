'use client';

import { useState, useMemo, useEffect } from 'react';
import { Application } from '@/types/application';
import ApplicationCard from './ApplicationCard';
import { useSession } from 'next-auth/react';

interface ApplicationsContentProps {
  applications: Application[];
}

export default function ApplicationsContent({ applications }: ApplicationsContentProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'popular'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [upvotedUids, setUpvotedUids] = useState<Set<string>>(new Set());

  // Fetch user's upvoted applications on mount and when session changes
  useEffect(() => {
    if (!session?.user) {
      setUpvotedUids(new Set());
      return;
    }

    const fetchUpvoted = async () => {
      try {
        const res = await fetch('/api/user/upvoted');
        if (res.ok) {
          const data = await res.json();
          setUpvotedUids(new Set(data.upvotedApplicationUids || []));
        }
      } catch (error) {
        console.error('Failed to fetch upvoted applications:', error);
      }
    };

    fetchUpvoted();
  }, [session]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    applications.forEach(app => {
      if (app.app_category) cats.add(app.app_category);
    });
    return Array.from(cats).sort();
  }, [applications]);

  // Filter and sort applications
  const filteredAndSortedApps = useMemo(() => {
    let filtered = [...applications];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.app_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(app => app.app_category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'recent':
          return new Date(b.updated_at || b.created_at || '').getTime() - 
                 new Date(a.updated_at || a.created_at || '').getTime();
        case 'popular':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [applications, searchQuery, selectedCategory, sortBy]);

  return (
    <>
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Applications
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              Browse comprehensive documentation for developer tools, libraries, and frameworks
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl text-white text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl"
              />
              <svg 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats and Controls Bar */}
      <section className="bg-white border-b border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-gray-900">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Apps</div>
              </div>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{filteredAndSortedApps.length}</div>
                <div className="text-sm text-gray-600">Showing</div>
              </div>
              {searchQuery && (
                <>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-600">Search:</span>
                    <span className="font-semibold text-gray-900">"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Filter/Sort */}
            <div className="flex gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                    selectedCategory !== 'all' 
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                      : 'border-gray-300 hover:border-indigo-600 hover:text-indigo-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                  {selectedCategory !== 'all' && (
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      1
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Filter by Category</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          selectedCategory === 'all' ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                            selectedCategory === category ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'recent' | 'popular')}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-indigo-600 transition-colors font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="name">Sort: A-Z</option>
                <option value="recent">Sort: Recent</option>
                <option value="popular">Sort: Popular</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-12 px-6 bg-theme-background">
        <div className="max-w-7xl mx-auto">
          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-indigo-900"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          {filteredAndSortedApps.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredAndSortedApps.length}</span> {filteredAndSortedApps.length === 1 ? 'application' : 'applications'}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedApps.map((app) => (
                  <ApplicationCard 
                    key={app.uid} 
                    application={app} 
                    isUpvoted={upvotedUids.has(app.uid)}
                    onUpvoteSuccess={() => {
                      // Add to upvoted set immediately for instant UI feedback
                      setUpvotedUids(prev => new Set([...prev, app.uid]));
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No applications found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}