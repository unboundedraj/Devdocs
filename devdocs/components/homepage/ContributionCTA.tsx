interface ContributionCTAProps {
  heading: string;
  description: string;
  url: string;
}

export default function ContributionCTA({ heading, description, url }: ContributionCTAProps) {
  return (
    <section className="py-20 px-6 bg-indigo-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-6">
          {heading}
        </h2>
        <p className="text-2xl mb-10 text-indigo-100">
          {description}
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href={url}
            className="bg-white text-indigo-600 px-10 py-5 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            Get Started Now →
          </a>
          <a
            href="/applications"
            className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-white hover:text-indigo-600 transition-colors"
          >
            Browse Documentation
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-indigo-200 text-sm">Applications</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1K+</div>
            <div className="text-indigo-200 text-sm">Developers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-indigo-200 text-sm">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}