import { getFAQs } from '@/lib/queries'
import { FAQ } from '@/types/faq'
import FAQClient from '@/components/faq/FAQClient'

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-pink-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            ✨ Help & Support
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Frequently Asked<br />Questions
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl">
            Find answers to common questions about Devdocs, content management,
            and how documentation is structured. Can't find what you're looking for?
          </p>
          <div className="mt-6">
            <a
              href="/support"
              className="inline-block text-indigo-600 bg-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>

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
