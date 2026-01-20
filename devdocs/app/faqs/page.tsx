import FAQList from '@/components/faq/FAQList';
import { FAQ } from '@/types/faq';

// Sample FAQs - You can replace this with data from your CMS
const sampleFAQs: FAQ[] = [
  {
    id: '1',
    question: 'What is DevDocs?',
    answer: 'DevDocs is a centralized hub for developer documentation. It makes it easier to discover, learn, and contribute documentation for various applications and tools.',
    category: 'General'
  },
  {
    id: '2',
    question: 'How do I contribute documentation?',
    answer: 'You can contribute documentation by visiting our Support page and following the contribution guidelines. We welcome contributions from the community!',
    category: 'General'
  },
  {
    id: '3',
    question: 'How can I find specific application documentation?',
    answer: 'Visit the Applications page to browse all available documentation. You can search or browse through categories to find what you\'re looking for.',
    category: 'Applications'
  },
  {
    id: '4',
    question: 'Is DevDocs free to use?',
    answer: 'Yes! DevDocs is completely free to use. All documentation is publicly available and accessible to everyone.',
    category: 'General'
  },
  {
    id: '5',
    question: 'How often is documentation updated?',
    answer: 'Documentation is updated regularly by our community contributors. Major updates are announced in the changelog section of each application.',
    category: 'Documentation'
  },
  {
    id: '6',
    question: 'Can I report issues with documentation?',
    answer: 'Yes! If you find any issues or inaccuracies, please report them through our Support page. We appreciate your feedback!',
    category: 'Support'
  }
];

export default function FAQsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Find answers to common questions about DevDocs, contributing, and using our platform.
          </p>
        </div>
      </section>

      {/* FAQs Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <FAQList faqs={sampleFAQs} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/support"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
