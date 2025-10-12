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

    switch (collectible.type) {
      case "coin":
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full">
            {/* Outer ring - gold */}
            <rect x="5" y="1" width="6" height="2" fill="hsl(45 100% 50%)" />
            <rect x="3" y="3" width="2" height="10" fill="hsl(45 100% 50%)" />
            <rect x="11" y="3" width="2" height="10" fill="hsl(45 100% 50%)" />
            <rect x="5" y="13" width="6" height="2" fill="hsl(45 100% 50%)" />
            
            {/* Inner fill - yellow */}
            <rect x="5" y="3" width="6" height="10" fill="hsl(50 100% 60%)" />
            
            {/* Highlight */}
            <rect x="6" y="4" width="3" height="3" fill="hsl(55 100% 80%)" />
            
            {/* Shadow/depth */}
            <rect x="9" y="8" width="2" height="4" fill="hsl(40 100% 35%)" />
            <rect x="6" y="11" width="4" height="1" fill="hsl(40 100% 35%)" />
          </svg>
        );
      case "star":
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full">
            {/* Star shape - bright yellow */}
            <rect x="7" y="0" width="2" height="2" fill="hsl(50 100% 60%)" />
            <rect x="5" y="2" width="6" height="2" fill="hsl(50 100% 60%)" />
            <rect x="3" y="4" width="2" height="2" fill="hsl(50 100% 60%)" />
            <rect x="11" y="4" width="2" height="2" fill="hsl(50 100% 60%)" />
            <rect x="1" y="6" width="14" height="2" fill="hsl(50 100% 60%)" />
            <rect x="3" y="8" width="10" height="2" fill="hsl(50 100% 60%)" />
            <rect x="5" y="10" width="6" height="2" fill="hsl(50 100% 60%)" />
            <rect x="5" y="12" width="2" height="2" fill="hsl(50 100% 60%)" />
            <rect x="9" y="12" width="2" height="2" fill="hsl(50 100% 60%)" />
            <rect x="7" y="14" width="2" height="2" fill="hsl(50 100% 60%)" />
            
            {/* Highlights - white/light yellow */}
            <rect x="7" y="2" width="2" height="1" fill="hsl(55 100% 85%)" />
            <rect x="6" y="6" width="4" height="2" fill="hsl(55 100% 75%)" />
            
            {/* Shadows - darker yellow */}
            <rect x="9" y="8" width="3" height="2" fill="hsl(45 100% 40%)" />
            <rect x="8" y="11" width="2" height="2" fill="hsl(45 100% 40%)" />
          </svg>
        );
      case "mushroom":
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full">
            {/* Red cap */}
            <rect x="4" y="1" width="8" height="2" fill="hsl(0 85% 55%)" />
            <rect x="2" y="3" width="12" height="2" fill="hsl(0 85% 55%)" />
            <rect x="1" y="5" width="14" height="3" fill="hsl(0 85% 55%)" />
            
            {/* White spots on cap */}
            <rect x="4" y="3" width="2" height="2" fill="white" />
            <rect x="10" y="3" width="2" height="2" fill="white" />
            <rect x="7" y="5" width="2" height="2" fill="white" />
            
            {/* Darker red shading */}
            <rect x="11" y="5" width="3" height="2" fill="hsl(0 85% 40%)" />
            
            {/* Beige/tan stem */}
            <rect x="5" y="8" width="6" height="7" fill="hsl(30 30% 85%)" />
            
            {/* Stem shading */}
            <rect x="8" y="9" width="2" height="5" fill="hsl(30 25% 70%)" />
            <rect x="6" y="13" width="4" height="1" fill="hsl(30 25% 70%)" />
            
            {/* Stem highlight */}
            <rect x="5" y="9" width="2" height="3" fill="hsl(30 35% 92%)" />
          </svg>
        );
      case "mystery":
        return (
          <svg viewBox="0 0 16 16" className="w-full h-full animate-pulse">
            {/* Outer border - bright yellow */}
            <rect x="0" y="0" width="16" height="16" fill="hsl(45 100% 50%)" />
            
            {/* Orange/brown inner block */}
            <rect x="2" y="2" width="12" height="12" fill="hsl(30 80% 45%)" />
            
            {/* Question mark - white */}
            <rect x="6" y="4" width="4" height="2" fill="white" />
            <rect x="8" y="6" width="2" height="2" fill="white" />
            <rect x="7" y="8" width="2" height="2" fill="white" />
            <rect x="7" y="11" width="2" height="2" fill="white" />
            
            {/* Darker shading on block */}
            <rect x="11" y="3" width="2" height="10" fill="hsl(25 70% 35%)" />
            <rect x="3" y="12" width="8" height="1" fill="hsl(25 70% 35%)" />
            
            {/* Highlight on block */}
            <rect x="3" y="3" width="2" height="2" fill="hsl(35 90% 60%)" />
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
