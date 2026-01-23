'use client'

import { useState } from 'react'
import { FAQ } from '@/types/faq'
import { ChevronDown, Lightbulb } from 'lucide-react'

interface FAQClientProps {
  faqs: FAQ[]
  categories: string[]
}

export default function FAQClient({ faqs, categories }: FAQClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const filteredFaqs =
    activeCategory === 'All'
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <div className="space-y-8">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category)
              setOpenIndex(null)
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Counter */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{filteredFaqs.length}</span> question{filteredFaqs.length !== 1 ? 's' : ''} {activeCategory !== 'All' && `in ${activeCategory}`}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === faq.uid
          const html =
            typeof faq.answer === 'string'
              ? faq.answer
              : faq.answer?.html || ''

          return (
            <div
              key={faq.uid}
              className={`rounded-lg border transition-all duration-300 ${
                isOpen
                  ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              <button
                onClick={() =>
                  setOpenIndex(isOpen ? null : faq.uid)
                }
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left group"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`mt-1 flex-shrink-0 transition-all duration-300 ${
                    isOpen ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
                  }`}>
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <span className={`font-medium transition-colors duration-200 ${
                    isOpen ? 'text-indigo-900' : 'text-gray-900 group-hover:text-indigo-700'
                  }`}>
                    {faq.question}
                  </span>
                </div>

                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-600' : 'text-gray-400'
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-indigo-200 px-6 py-5 pt-4 animate-in fade-in duration-300">
                  <div
                    className="prose prose-sm prose-gray max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              )}
            </div>
          )
        })}

        {filteredFaqs.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No FAQs in this category</p>
            <p className="text-sm text-gray-500 mt-1">Try selecting a different category or check back later</p>
          </div>
        )}
      </div>
    </div>
  )
}
