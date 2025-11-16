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
      .order("display_order");
    if (data) setAchievements(data);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "trophy":
        return <Trophy className="w-8 h-8" />;
      case "award":
        return <Award className="w-8 h-8" />;
      case "target":
        return <Target className="w-8 h-8" />;
      case "rocket":
        return <Rocket className="w-8 h-8" />;
      case "users":
        return <Users className="w-8 h-8" />;
      case "lightbulb":
        return <Lightbulb className="w-8 h-8" />;
      default:
        return <Trophy className="w-8 h-8" />;
    }
  };

  return (
    <section id="achievements" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-pixel text-center mb-4 text-primary">
          Achievements
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 block-shadow" />

        <div className="max-w-4xl mx-auto space-y-4">
          {achievements.map((achievement, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-border bg-card block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-1 animate-pixel-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary">
                  {getIcon(achievement.icon_type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-xs font-pixel text-accent">{achievement.year}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-pixel text-primary">
                        +{achievement.xp}
                      </div>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/70 mb-3">
                    {achievement.description}
                  </p>

                  {/* XP Progress Bar */}
                  <div className="relative h-6 bg-muted rounded overflow-hidden block-shadow">
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
