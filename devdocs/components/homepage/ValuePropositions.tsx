interface ValueProposition {
  proposition_title: string;
  proposition_description: string;
}

interface ValuePropositionsProps {
  propositions: ValueProposition[];
}

export default function ValuePropositions({ propositions }: ValuePropositionsProps) {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose DevDocs?
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to discover, learn, and master developer tools
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {propositions?.map((prop, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">{index === 0 ? '📚' : index === 1 ? '⚡' : '👥'}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">
                {prop.proposition_title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {prop.proposition_description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}