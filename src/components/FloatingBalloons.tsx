import { useEffect, useState } from "react";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--minecraft-red))",
  "hsl(var(--minecraft-blue))",
  "hsl(var(--minecraft-yellow))",
];

const FloatingBalloons = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to spawn a balloon
      if (Math.random() > 0.7 && balloons.length < 15) {
        const newBalloon: Balloon = {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 40 + Math.random() * 30,
          speed: 2 + Math.random() * 3,
        };
        setBalloons((prev) => [...prev, newBalloon]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [balloons.length]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setBalloons((prev) =>
        prev
          .map((balloon) => ({
            ...balloon,
            y: balloon.y - balloon.speed,
            x: balloon.x + Math.sin(balloon.y / 50) * 2,
          }))
          .filter((balloon) => balloon.y > -100)
      );
    }, 50);

    return () => clearInterval(animationFrame);
  }, []);

  const popBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          onClick={() => popBalloon(balloon.id)}
          className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-110"
          style={{
            left: `${balloon.x}px`,
            top: `${balloon.y}px`,
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.2}px`,
          }}
        >
          {/* Balloon body - 8-bit pixel style */}
          <div className="relative w-full h-full">
            <svg
              viewBox="0 0 20 24"
              className="w-full h-full drop-shadow-lg"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
            >
              {/* Main balloon shape in pixel art style */}
              <rect x="6" y="2" width="8" height="2" fill={balloon.color} />
              <rect x="4" y="4" width="12" height="2" fill={balloon.color} />
              <rect x="3" y="6" width="14" height="8" fill={balloon.color} />
              <rect x="4" y="14" width="12" height="2" fill={balloon.color} />
              <rect x="6" y="16" width="8" height="2" fill={balloon.color} />
              
              {/* Highlight */}
              <rect x="7" y="5" width="3" height="3" fill="rgba(255,255,255,0.4)" />
              
              {/* String */}
              <rect x="9" y="18" width="2" height="6" fill="hsl(var(--foreground))" opacity="0.6" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingBalloons;
