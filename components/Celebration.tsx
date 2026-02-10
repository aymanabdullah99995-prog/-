
import React, { useEffect, useRef } from 'react';

const Celebration: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let particles: Particle[] = [];
    // ألوان أكثر حيوية وتنوعاً
    const colors = ['#3B82F6', '#F59E0B', '#FFFFFF', '#60A5FA', '#FBBF24', '#EF4444', '#10B981', '#A855F7', '#EC4899'];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      gravity: number;
      type: 'firework' | 'confetti';
      rotation: number;
      rotationSpeed: number;

      constructor(x: number, y: number, type: 'firework' | 'confetti' = 'confetti') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        
        if (type === 'firework') {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 16 + 6; // سرعة أعلى
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed - 2;
          this.size = Math.random() * 5 + 2;
          this.gravity = 0.18;
        } else {
          this.vx = Math.random() * 10 - 5;
          this.vy = Math.random() * 8 + 4;
          this.size = Math.random() * 8 + 4; // أحجام أكبر
          this.gravity = 0.1;
        }

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        
        if (this.type === 'firework') {
          this.vx *= 0.97;
          this.life -= 0.015;
        } else {
          this.life -= 0.007;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        
        if (this.type === 'confetti') {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size/2);
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          if (this.life > 0.3) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
          }
        }
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const createFirework = (x: number, y: number) => {
      const count = 120; // جزيئات أكثر
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, 'firework'));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // وتيرة مكثفة للألعاب النارية
      if (Math.random() < 0.12) {
        createFirework(
          Math.random() * canvas.width, 
          Math.random() * (canvas.height * 0.6)
        );
      }

      // مطر كثيف من القصاصات
      if (Math.random() < 0.6) {
        particles.push(new Particle(Math.random() * canvas.width, -30, 'confetti'));
      }

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default Celebration;
