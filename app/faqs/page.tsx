import { getFAQs } from '@/lib/queries'
import { FAQ } from '@/types/faq'
import FAQClient from '@/components/faq/FAQClient'
import FAQHeader from '@/components/faq/FAQHeader'

export default async function FAQsPage() {
  const faqs: FAQ[] = await getFAQs()
  const categories = Array.from(
    new Set(
      faqs
        .map((faq) => faq.category)
        .filter((category): category is string => Boolean(category))
    )
  )

  return (
    <main className="min-h-screen bg-theme-background">
      <FAQHeader />

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="p-8 sm:p-12 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <FAQClient faqs={faqs} categories={categories} />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/chat"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              💬 Chat with AI
            </a>
            <a
              href="/support"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Get Support
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}