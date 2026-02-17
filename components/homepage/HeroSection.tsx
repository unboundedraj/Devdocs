'use client';
import { useEffect, useRef } from 'react';
import { getEditTags } from '@/lib/utils';

interface HeroSectionProps {
  entry?: any;
  title: string;
  description: string;
}

export default function HeroSection({ entry, title, description }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.9;
        this.speedY = (Math.random() - 0.5) * 0.9;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        ctx!.fillStyle = 'rgba(156, 163, 175, 0.4)';
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number | null = null;

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative bg-black text-white min-h-[calc(100vh-4rem)] flex items-center px-6 overflow-hidden">
      {/* Particle Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Decorative blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gray-700 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-600 rounded-full blur-3xl opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-500 rounded-full blur-3xl opacity-10" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center z-10 flex flex-col items-center justify-center py-12">
        {/* Badge */}
        <div className="inline-block mb-6 animate-pulse">
          <span className="bg-gray-800/80 backdrop-blur-sm text-gray-100 px-6 py-2 rounded-full text-sm font-semibold border border-gray-700 shadow-lg">
            ✨ Your Developer Documentation Hub
          </span>
        </div>

        {/* Title */}
        <h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          {...getEditTags(entry, 'title')}
        >
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
            {title}
          </span>
        </h1>

        {/* Description */}
        <p 
          className="text-lg md:text-xl lg:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
          {...getEditTags(entry, 'hero_description')}
        >
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/applications"
            className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-gray-500/20 hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              Browse Documentation
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
          <a
            href="/chat"
            className="group bg-transparent text-white px-8 py-4 rounded-xl font-bold text-base md:text-lg hover:bg-gray-800/50 transition-all duration-300 border-2 border-gray-600 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              💬 Try AI Chat
            </span>
          </a>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 43.3C840 46.7 960 53.3 1080 56.7C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white" fillOpacity="0.1"/>
        </svg>
      </div>
    </section>
  );
}