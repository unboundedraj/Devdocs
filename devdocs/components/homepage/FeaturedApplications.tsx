import { Application } from '@/types/application';

interface FeaturedApplicationsProps {
  applications: Application[];
}

export default function FeaturedApplications({ applications }: FeaturedApplicationsProps) {
  // Show first 6 featured apps
  const featuredApps = applications.slice(0, 6);

  if (!featuredApps || featuredApps.length === 0) {
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Applications
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular documentation
            </p>
          </div>

          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300 shadow-sm">
            <div className="text-7xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Coming Soon
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Featured applications will appear here. Be among the first to contribute!
            </p>
            <a
              href="/applications"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse All Applications →
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ⭐ Featured
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Documentation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the most loved tools and frameworks in our community
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredApps.map((app, index) => (
            <a
              key={app.uid}
              href={`/applications/${app.uid}`}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-indigo-300 flex flex-col"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Category Badge */}
                {app.app_category && (
                  <div className="mb-4">
                    <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold">
                      {app.app_category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {app.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
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
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {app.maintainer_name || 'Community'}
                  </span>
                  <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                    View Docs
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="/applications"
            className="inline-flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
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
