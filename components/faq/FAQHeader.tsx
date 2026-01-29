'use client';

import { WavyBackground } from '../ui/wavy-background';

export default function FAQHeader() {
  return (
    <>
      {/* Header Section */}
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <div className="relative text-white text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            ✨ Help & Support
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Frequently Asked<br />Questions
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Find answers to common questions about Devdocs, content management,
            and how documentation is structured. Can't find what you're looking for?
          </p>
          <div className="mt-6">
            <a
              href="/support"
              className="inline-block text-white bg-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors border border-white/20"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </WavyBackground>
    </>
  );
}
