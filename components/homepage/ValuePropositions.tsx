interface ValueProposition {
  proposition_title: string;
  proposition_description: string;
}

interface ValuePropositionsProps {
  propositions: ValueProposition[];
}

export default function ValuePropositions({ propositions }: ValuePropositionsProps) {
  return (
    <section className="py-20 px-6 bg-theme-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl text-theme-primary font-bold text-center mb-4">
          Why Choose DevDocs?
        </h2>
        <p className="text-xl text-theme-secondary text-center mb-12 max-w-2xl mx-auto">
          Everything you need to discover, learn, and master developer tools
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {propositions?.map((prop, index) => (
            <div 
              key={index}
              className="group relative bg-theme-card p-8 rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-theme shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-theme-primary rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <span className="text-4xl">
                    {index === 0 ? '📚' : index === 1 ? '⚡' : '👥'}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-theme-primary group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {prop.proposition_title}
                </h3>
                
                <p className="text-theme-secondary leading-relaxed group-hover:text-theme-primary transition-colors duration-300">
                  {prop.proposition_description}
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-theme-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}