export default function FeaturedApplications() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Featured Applications
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12">
          Explore our most popular documentation
        </p>
        
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 mb-6">
            Featured applications will appear here soon!
          </p>
          <a 
            href="/applications"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Browse All Applications →
          </a>
        </div>
      </div>
    </section>
  );
}