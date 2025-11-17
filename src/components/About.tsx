import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TimelineCarousel from "./TimelineCarousel";

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

        <TimelineCarousel items={timeline} />

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
