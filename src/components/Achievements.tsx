import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Award, Target, Zap, Rocket, Users, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Achievements = () => {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_published", true)
      .order("year", { ascending: false }); // Changed sorting to newest first by year
    if (data) setAchievements(data);
  };

  const getIcon = (iconType: string) => {
    const iconClass = "w-6 h-6 sm:w-8 sm:h-8";
    switch (iconType) {
      case "trophy":
        return <Trophy className={iconClass} />;
      case "award":
        return <Award className={iconClass} />;
      case "target":
        return <Target className={iconClass} />;
      case "rocket":
        return <Rocket className={iconClass} />;
      case "users":
        return <Users className={iconClass} />;
      case "lightbulb":
        return <Lightbulb className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  return (
    <section id="achievements" className="py-12 sm:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-pixel text-center mb-3 sm:mb-4 text-primary">
          Achievements
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-8 sm:mb-12 block-shadow" />

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="p-4 sm:p-6 border-2 border-border bg-card block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-1 animate-pixel-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                  {getIcon(achievement.icon_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-xs font-pixel text-accent">{achievement.year}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl sm:text-2xl font-pixel text-primary">
                        +{achievement.xp}
                      </div>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/70 mb-2 sm:mb-3">
                    {achievement.description}
                  </p>

                  {/* XP Progress Bar */}
                  <div className="relative h-5 sm:h-6 bg-muted rounded overflow-hidden block-shadow">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                      style={{
                        width: `${(achievement.xp / 1000) * 100}%`,
                        animationDelay: `${index * 0.2}s`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-pixel text-foreground mix-blend-difference">
                        LEVEL {Math.floor(achievement.xp / 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;