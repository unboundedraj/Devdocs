import { BookOpen, Zap, Users } from 'lucide-react';

interface ValueProposition {
  proposition_title: string;
  proposition_description: string;
}

interface ValuePropositionsProps {
  propositions: ValueProposition[];
}

const icons = [BookOpen, Zap, Users];

export default function ValuePropositions({ propositions }: ValuePropositionsProps) {
  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Subtle background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-400 opacity-5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl text-white font-bold text-center mb-4 bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
          Why Choose DevDocs?
        </h2>
        <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to discover, learn, and master developer tools
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {propositions?.map((prop, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-gray-900 to-black p-10 rounded-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border border-gray-800 shadow-2xl hover:shadow-gray-900/50 backdrop-blur-sm min-h-[400px] flex flex-col"
            >
              {/* Metallic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 via-transparent to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              {/* Blur accent on edges */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-500 opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg border border-gray-700 backdrop-blur-sm">
                  {(() => {
                    const Icon = icons[index % icons.length];
                    return <Icon className="w-8 h-8 text-white" strokeWidth={2} />;
                  })()}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-100 transition-all duration-300">
                  {prop.proposition_title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {prop.proposition_description}
                </p>
              </div>
              
              {/* Bottom accent line with metallic gradient */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-lg shadow-gray-500/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}