import { FAQ } from '@/types/faq';
import FAQItem from './FAQItem';

interface FAQListProps {
  faqs: FAQ[];
}

export default function FAQList({ faqs }: FAQListProps) {
  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-lg">No FAQs available at this time.</p>
      </div>
    );
  }

  // Group FAQs by category if available
  const groupedFAQs = faqs.reduce((acc: Record<string, FAQ[]>, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <div className="space-y-12">
      {Object.entries(groupedFAQs).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{category}</h3>
          <div className="space-y-4">
            {items.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
