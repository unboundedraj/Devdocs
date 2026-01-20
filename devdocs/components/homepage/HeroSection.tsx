interface HeroSectionProps {
  title: string;
  description: string;
}

export default function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <section className="bg-indigo-600 text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-2xl mb-10 text-indigo-100">
          {description}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/applications"
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Explore Documentation →
          </a>
          <a
            href="/chat"
            className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-400 transition-colors border-2 border-white"
          >
            💬 Try AI Chat
          </a>
        </div>
      </div>
    </section>
  );
}