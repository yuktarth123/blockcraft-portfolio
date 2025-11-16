import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const About = () => {
  const [profile, setProfile] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchTimeline();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profile_content")
      .select("*")
      .maybeSingle();
    if (data) setProfile(data);
  };

  const fetchTimeline = async () => {
    const { data } = await supabase
      .from("timeline_items")
      .select("*")
      .eq("is_published", true)
      .order("display_order");
    if (data) setTimeline(data);
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "briefcase":
        return <Briefcase className="w-6 h-6" />;
      case "graduation":
        return <GraduationCap className="w-6 h-6" />;
      default:
        return <Briefcase className="w-6 h-6" />;
    }
  };

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-pixel text-center mb-4 text-primary">
          {profile?.about_title || "About Me"}
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 block-shadow" />
        
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-lg text-center text-foreground/80 leading-relaxed">
            {profile?.about_text || "I'm a Product Manager passionate about building digital experiences that solve real problems."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {timeline.map((item, index) => (
            <Card 
              key={index} 
              className="p-6 border-2 border-border bg-card block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-1 animate-pixel-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                {getIcon(item.icon_type)}
              </div>
              <p className="font-pixel text-xs text-accent mb-2">{item.year}</p>
              <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-foreground/70">{item.description}</p>
            </Card>
          ))}
        </div>

        {profile?.resume_url && (
          <div className="text-center mt-12">
            <a 
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-pixel text-xs rounded block-shadow hover:block-shadow-hover transition-all hover:-translate-y-1"
            >
              <Trophy className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
