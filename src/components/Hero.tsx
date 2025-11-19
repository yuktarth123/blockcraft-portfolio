import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroLandscape from "@/assets/hero-landscape.jpg";
import avatarPixel from "@/assets/avatar-pixel.png";

const Hero = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("profile_content")
      .select("*")
      .maybeSingle();
    if (data) setProfile(data);
    setIsLoading(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroLandscape})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="animate-pixel-fade-in">
          {!isLoading && (
            <img 
              src={profile?.hero_avatar_url || avatarPixel} 
              alt={`${profile?.hero_title || 'Yuktarth Nagar'} Avatar`}
              className="w-32 h-32 mx-auto mb-8 animate-float block-shadow-hover rounded-lg"
              loading="eager"
              fetchPriority="high"
            />
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-pixel mb-6 text-primary leading-tight">
            {profile?.hero_title || "Yuktarth Nagar"}
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl font-pixel mb-4 text-secondary">
            {profile?.hero_subtitle || "Product Manager"}
          </p>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-foreground/80 font-sans">
            {profile?.tagline || "Crafting Digital Experiences, One Block at a Time"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection("webapps")}
              className="font-pixel text-xs bg-primary hover:bg-primary/90 text-primary-foreground block-shadow hover:block-shadow-hover transition-all"
            >
              Web Apps Gallery
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="font-pixel text-xs border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground block-shadow hover:block-shadow-hover transition-all"
            >
              Get in Touch
            </Button>
          </div>
        </div>
        
        <button 
          onClick={() => scrollToSection("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-block text-primary hover:text-primary/80 transition-colors"
          aria-label="Scroll to about section"
        >
          <ArrowDown size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
