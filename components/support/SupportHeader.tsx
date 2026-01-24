'use client';

interface SupportHeaderProps {
  title: string;
  description?: string;
}

export default function SupportHeader({ title, description }: SupportHeaderProps) {
  return (
    <>
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white py-32 px-6 overflow-hidden">
        {/* Particle Background Canvas */}
        <canvas
          ref={(canvas) => {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const particles: any[] = [];
            const particleCount = 80;

            class Particle {
              x: number;
              y: number;
              size: number;
              speedX: number;
              speedY: number;

              constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1.1;
                this.speedY = (Math.random() - 0.5) * 1.1;
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

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-3 py-1 bg-white/20 rounded-lg text-sm font-medium backdrop-blur-sm">
            🙋 We're Here to Help
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-indigo-100 leading-relaxed max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
