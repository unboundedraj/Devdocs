import { getFAQs } from '@/lib/queries'
import { setLivePreviewQueryParams } from '@/lib/utils'
import { FAQ } from '@/types/faq'
import FAQClient from '@/components/faq/FAQClient'
import FAQHeader from '@/components/faq/FAQHeader'
import { WavyBackground } from '@/components/ui/wavy-background'

export default async function FAQsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  setLivePreviewQueryParams(params);
  
  const faqs: FAQ[] = await getFAQs()
  const categories = Array.from(
    new Set(
      faqs
        .map((faq) => faq.category)
        .filter((category): category is string => Boolean(category))
    )
  )

  return (
    <main className="min-h-screen bg-black relative">
      {/* Fixed Wavy Background Only - No Text */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <WavyBackground />
      </div>

      {/* Content Section - Scrollable (with header text) */}
      <div className="relative z-10 pt-8">
        {/* Header Text Section */}
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm text-white">
            ✨ Help & Support
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
            Frequently Asked<br />Questions
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
            Find answers to common questions about Devdocs, content management,
            and how documentation is structured. Can't find what you're looking for?
          </p>
          <a
            href="/support"
            className="inline-block text-white bg-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors border border-white/20"
          >
            Contact Support →
          </a>
        </div>

        {/* Questions Box */}
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="rounded-2xl bg-black border border-gray-800 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-8 sm:p-12 bg-black">
              <FAQClient faqs={faqs} categories={categories} />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Still have questions?</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/chat"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                💬 Chat with AI
              </a>
              <a
                href="/support"
                className="px-6 py-3 bg-gray-900 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-colors border border-gray-700"
              >
                Get Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}