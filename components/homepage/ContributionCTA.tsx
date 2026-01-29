"use client";

import React from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

interface ContributionCTAProps {
  heading: string;
  description: string;
  url: string;
}

export default function ContributionCTA({ heading, description, url }: ContributionCTAProps) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <section className="relative h-[150vh] w-full bg-black overflow-clip z-20" ref={ref}>
      {/* GoogleGeminiEffect Background */}
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title={heading}
        description={description}
        ctaUrl={url}
      />

      {/* Content */}
      <div className="relative z-10 py-20 px-6">
        {/* Empty content div - buttons and stats now in background */}
      </div>
    </section>
  );
}