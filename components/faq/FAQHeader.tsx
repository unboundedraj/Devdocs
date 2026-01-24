'use client';

export default function FAQHeader() {
  return (
    <>
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-20 px-4 overflow-hidden">
        {/* Particle Background Canvas */}
        <canvas
          ref={(canvas) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const particles: any[] = [];
            const particleCount = 70;

            class Particle {
              x: number;
              y: number;
              size: number;
              speedX: number;
              speedY: number;

              constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.7;
                this.speedY = (Math.random() - 0.5) * 0.7;
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
                ctx!.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
              }
            }

            for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle());
            }

            let animationFrameId: number;
            const animate = () => {
              ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
              particles.forEach((particle) => {
                particle.update();
                particle.draw();
              });
              animationFrameId = requestAnimationFrame(animate);
            };

            animate();

            return () => {
              if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
              }
            };
          }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Blur accent on edges */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl" />

        <div className="mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
            ✨ Help & Support
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Frequently Asked<br />Questions
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
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
    </>
  );
}
