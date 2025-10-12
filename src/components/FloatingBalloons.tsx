import { useEffect, useState } from "react";

interface Collectible {
  id: number;
  x: number;
  y: number;
  type: "coin" | "star" | "mushroom" | "mystery";
  size: number;
  speed: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  score: number;
  life: number;
}

const COLLECTIBLE_TYPES = [
  { type: "coin" as const, weight: 40, score: 100 },
  { type: "star" as const, weight: 15, score: 500 },
  { type: "mushroom" as const, weight: 20, score: 200 },
  { type: "mystery" as const, weight: 25, score: 300 },
];

const MarioCollectibles = () => {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const getRandomType = () => {
    const total = COLLECTIBLE_TYPES.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * total;
    for (const type of COLLECTIBLE_TYPES) {
      if (random < type.weight) return type;
      random -= type.weight;
    }
    return COLLECTIBLE_TYPES[0];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && collectibles.length < 12) {
        const typeData = getRandomType();
        const newCollectible: Collectible = {
          id: Date.now() + Math.random(),
          x: Math.random() * (window.innerWidth - 60),
          y: window.innerHeight + 50,
          type: typeData.type,
          size: 50,
          speed: 1.5 + Math.random() * 2,
        };
        setCollectibles((prev) => [...prev, newCollectible]);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [collectibles.length]);

  useEffect(() => {
    const animationFrame = setInterval(() => {
      setCollectibles((prev) =>
        prev
          .map((collectible) => ({
            ...collectible,
            y: collectible.y - collectible.speed,
            x: collectible.x + Math.sin(collectible.y / 40) * 1.5,
          }))
          .filter((collectible) => collectible.y > -100)
      );

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5,
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );

      setScorePopups((prev) =>
        prev
          .map((s) => ({
            ...s,
            y: s.y - 2,
            life: s.life - 1,
          }))
          .filter((s) => s.life > 0)
      );
    }, 50);

    return () => clearInterval(animationFrame);
  }, []);

  const collectItem = (collectible: Collectible) => {
    const typeData = COLLECTIBLE_TYPES.find((t) => t.type === collectible.type)!;
    
    // Remove collectible
    setCollectibles((prev) => prev.filter((c) => c.id !== collectible.id));
    
    // Add score
    setTotalScore((prev) => prev + typeData.score);
    
    // Create score popup
    setScorePopups((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: collectible.x,
        y: collectible.y,
        score: typeData.score,
        life: 60,
      },
    ]);

    // Create particle explosion
    const colors = {
      coin: "hsl(var(--minecraft-yellow))",
      star: "hsl(var(--minecraft-yellow))",
      mushroom: "hsl(var(--minecraft-red))",
      mystery: "hsl(var(--primary))",
    };

    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: collectible.x + collectible.size / 2,
      y: collectible.y + collectible.size / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 30 + Math.random() * 20,
      color: colors[collectible.type],
    }));

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const renderCollectible = (collectible: Collectible) => {
    const size = collectible.size;
    const pixelSize = size / 8;

    switch (collectible.type) {
      case "coin":
        return (
          <svg viewBox="0 0 8 8" className="w-full h-full">
            <rect x="2" y="0" width="4" height="1" fill="hsl(var(--minecraft-yellow))" />
            <rect x="1" y="1" width="6" height="6" fill="hsl(var(--minecraft-yellow))" />
            <rect x="2" y="7" width="4" height="1" fill="hsl(var(--minecraft-yellow))" />
            <rect x="3" y="2" width="2" height="4" fill="hsl(45 100% 35%)" />
          </svg>
        );
      case "star":
        return (
          <svg viewBox="0 0 8 8" className="w-full h-full">
            <rect x="3" y="0" width="2" height="1" fill="hsl(var(--minecraft-yellow))" />
            <rect x="2" y="1" width="4" height="1" fill="hsl(var(--minecraft-yellow))" />
            <rect x="0" y="2" width="8" height="2" fill="hsl(var(--minecraft-yellow))" />
            <rect x="1" y="4" width="6" height="2" fill="hsl(var(--minecraft-yellow))" />
            <rect x="2" y="6" width="4" height="2" fill="hsl(var(--minecraft-yellow))" />
            <rect x="4" y="2" width="2" height="2" fill="hsl(45 100% 35%)" />
          </svg>
        );
      case "mushroom":
        return (
          <svg viewBox="0 0 8 8" className="w-full h-full">
            <rect x="2" y="0" width="4" height="1" fill="hsl(var(--minecraft-red))" />
            <rect x="1" y="1" width="6" height="3" fill="hsl(var(--minecraft-red))" />
            <rect x="2" y="2" width="1" height="1" fill="white" />
            <rect x="5" y="2" width="1" height="1" fill="white" />
            <rect x="2" y="4" width="4" height="4" fill="hsl(45 20% 85%)" />
            <rect x="3" y="5" width="2" height="2" fill="hsl(45 20% 70%)" />
          </svg>
        );
      case "mystery":
        return (
          <svg viewBox="0 0 8 8" className="w-full h-full">
            <rect x="0" y="0" width="8" height="8" fill="hsl(var(--minecraft-yellow))" />
            <rect x="1" y="1" width="6" height="6" fill="hsl(30 80% 45%)" />
            <rect x="3" y="2" width="2" height="1" fill="white" />
            <rect x="3" y="3" width="2" height="1" fill="white" />
            <rect x="4" y="4" width="1" height="1" fill="white" />
            <rect x="3" y="5" width="2" height="1" fill="white" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Score Counter */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="bg-background/90 border-4 border-primary px-6 py-3 block-shadow">
          <p className="font-pixel text-xs text-primary">SCORE</p>
          <p className="font-pixel text-lg text-foreground">{totalScore.toLocaleString()}</p>
        </div>
      </div>

      {/* Collectibles */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {collectibles.map((collectible) => (
          <div
            key={collectible.id}
            onClick={() => collectItem(collectible)}
            className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-110 animate-pulse"
            style={{
              left: `${collectible.x}px`,
              top: `${collectible.y}px`,
              width: `${collectible.size}px`,
              height: `${collectible.size}px`,
            }}
          >
            {renderCollectible(collectible)}
          </div>
        ))}

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              backgroundColor: particle.color,
              opacity: particle.life / 50,
            }}
          />
        ))}

        {/* Score Popups */}
        {scorePopups.map((popup) => (
          <div
            key={popup.id}
            className="absolute font-pixel text-sm text-primary pointer-events-none"
            style={{
              left: `${popup.x}px`,
              top: `${popup.y}px`,
              opacity: popup.life / 60,
              textShadow: "2px 2px 0 hsl(var(--background))",
            }}
          >
            +{popup.score} XP
          </div>
        ))}
      </div>
    </>
  );
};

export default MarioCollectibles;
