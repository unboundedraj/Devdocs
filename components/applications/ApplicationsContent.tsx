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
  const [likedUids, setLikedUids] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    if (!session?.user) {
      setLikedUids(new Set());
      return;
    }

    const fetchLiked = async () => {
      try {
        const res = await fetch('/api/user/liked');
        if (res.ok) {
          const data = await res.json();
          setLikedUids(new Set(data.likedApplicationUids || []));
        }
      } catch (error) {
        console.error('Failed to fetch liked applications:', error);
      }
    };

    fetchLiked();
  }, [session]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    applications.forEach(app => {
      if (app.app_category) cats.add(app.app_category);
    });
    return Array.from(cats).sort();
  }, [applications]);

  const filteredAndSortedApps = useMemo(() => {
    let filtered = [...applications];

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
      {/* Hero Section with Search - Centered */}
      <section className="relative bg-black text-white py-32 px-6 overflow-hidden">
        {/* Particle Background Canvas */}
        <canvas
          ref={(canvas) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const particles: any[] = [];
            const particleCount = 50;

            class Particle {
              x: number;
              y: number;
              size: number;
              speedX: number;
              speedY: number;

              constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.9;
                this.speedY = (Math.random() - 0.5) * 0.9;
              }

              update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas!.width) this.x = 0;
                if (this.x < 0) this.x = canvas!.width;
                if (this.y > canvas!.height) this.y = 0;
                if (this.y < 0) this.y = canvas!.height;
              }

              draw() {
                ctx!.fillStyle = 'rgba(156, 163, 175, 0.4)';
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
              }
            }

            for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle());
            }

            let animationFrameId: number;
            const animate = () => {
              ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
              particles.forEach((particle) => {
                particle.update();
                particle.draw();
              });
              animationFrameId = requestAnimationFrame(animate);
            };

            animate();

            // Cleanup function
            return () => {
              if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
              }
            };
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Applications
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8">
              Browse comprehensive documentation for developer tools, libraries, and frameworks
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-indigo-200 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl"
              />
              <svg 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-200"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-indigo-200 hover:text-white"
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

      {/* Stats and Controls Bar - Dark Theme */}
      <section className="bg-black border-b border-gray-800 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-white">{applications.length}</div>
                <div className="text-sm text-gray-400">Total Apps</div>
              </div>
              <div className="h-12 w-px bg-gray-800"></div>
              <div>
                <div className="text-3xl font-bold text-white">{filteredAndSortedApps.length}</div>
                <div className="text-sm text-gray-400">Showing</div>
              </div>
              {searchQuery && (
                <>
                  <div className="h-12 w-px bg-gray-800"></div>
                  <div className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                    <span className="text-sm text-gray-400">Search:</span>
                    <span className="font-semibold text-white">"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 text-gray-500 hover:text-gray-300"
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
                      ? 'border-gray-600 text-white bg-gray-800' 
                      : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                  {selectedCategory !== 'all' && (
                    <span className="bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      1
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl border border-gray-800 py-2 z-50 backdrop-blur-sm">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <h3 className="font-semibold text-white">Filter by Category</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300 hover:text-white ${
                          selectedCategory === 'all' ? 'bg-gray-800 text-white font-semibold' : ''
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
                          className={`w-full text-left px-4 py-2 hover:bg-gray-800 text-gray-300 hover:text-white ${
                            selectedCategory === category ? 'bg-gray-800 text-white font-semibold' : ''
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
                className="px-4 py-2 border-2 border-gray-700 rounded-lg hover:border-gray-600 transition-colors font-medium appearance-none bg-black text-gray-300 hover:text-white cursor-pointer"
              >
                <option value="name">Sort: A-Z</option>
                <option value="recent">Sort: Recent</option>
                <option value="popular">Sort: Popular</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Grid - Dark Theme */}
      <section className="py-12 px-6 bg-black relative overflow-hidden">
        {/* Background blur effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400 opacity-5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'all') && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="hover:text-white"
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
                className="text-sm text-gray-400 hover:text-white font-medium"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          {filteredAndSortedApps.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-400">
                  Showing <span className="font-semibold text-white">{filteredAndSortedApps.length}</span> {filteredAndSortedApps.length === 1 ? 'application' : 'applications'}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedApps.map((app) => (
                  <ApplicationCard 
                    key={app.uid} 
                    application={app} 
                    isUpvoted={upvotedUids.has(app.uid)}
                    isLiked={likedUids.has(app.uid)}
                    onUpvoteSuccess={() => {
                      setUpvotedUids(prev => new Set([...prev, app.uid]));
                    }}
                    onLikeSuccess={() => {
                      setLikedUids(prev => new Set([...prev, app.uid]));
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No applications found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-block bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-500 transition-all border border-gray-600 shadow-lg"
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