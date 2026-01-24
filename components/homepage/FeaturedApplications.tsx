import { Application } from '@/types/application';

interface FeaturedApplicationsProps {
  applications: Application[];
}

export default function FeaturedApplications({ applications }: FeaturedApplicationsProps) {
  // Show first 6 featured apps
  const featuredApps = applications.slice(0, 6);

  if (!featuredApps || featuredApps.length === 0) {
    return (
      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Applications
            </h2>
            <p className="text-xl text-gray-400">
              Discover our most popular documentation
            </p>
          </div>

          <div className="text-center py-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-dashed border-gray-700 shadow-sm">
            <div className="text-7xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Coming Soon
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Featured applications will appear here. Be among the first to contribute!
            </p>
            <a
              href="/applications"
              className="inline-block bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl"
            >
              Browse All Applications →
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-black relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400 opacity-5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-gray-700">
            ⭐ Featured
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent mb-4">
            Popular Documentations
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore the most loved tools and frameworks in our community
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredApps.map((app, index) => (
            <a
              key={app.uid}
              href={`/applications/${app.uid}`}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl hover:shadow-indigo-900/50 transition-all duration-300 overflow-hidden border border-gray-800 hover:border-indigo-500 flex flex-col backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient header with metallic effect */}
              <div className="h-2 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700"></div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col relative z-10">
                {/* Category Badge */}
                {app.app_category && (
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-700">
                      {app.app_category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent mb-3 group-hover:text-indigo-400 transition-all">
                  {app.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3 group-hover:text-gray-300 transition-colors">
                  {app.app_description?.substring(0, 120) ||
                    app.main_description?.replace(/<[^>]*>/g, '').substring(0, 120) ||
                    `Comprehensive documentation and guides for ${app.title}`}
                  ...
                </p>

                {/* Tags */}
                {app.tags && app.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs border border-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {app.maintainer_name || 'Community'}
                  </span>
                  <div className="flex items-center text-gray-300 font-semibold text-sm group-hover:translate-x-2 transition-transform group-hover:text-white">
                    View Docs
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Decoration with blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="/applications"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-gray-800 hover:to-gray-900 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-2xl backdrop-blur-sm"
          >
            View All Applications
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}