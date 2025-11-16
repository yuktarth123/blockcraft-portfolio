import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import WebApps from "@/components/WebApps";
import Achievements from "@/components/Achievements";
import YouTube from "@/components/YouTube";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MarioCollectibles from "@/components/FloatingBalloons";

const Index = () => {
  const [visibility, setVisibility] = useState({
    show_timeline: true,
    show_projects: true,
    show_webapps: true,
    show_achievements: true,
    show_youtube: true,
  });

  useEffect(() => {
    fetchVisibility();
  }, []);

  const fetchVisibility = async () => {
    const { data } = await supabase
      .from('profile_content')
      .select('show_timeline, show_projects, show_webapps, show_achievements, show_youtube')
      .single();
    
    if (data) {
      setVisibility({
        show_timeline: data.show_timeline ?? true,
        show_projects: data.show_projects ?? true,
        show_webapps: data.show_webapps ?? true,
        show_achievements: data.show_achievements ?? true,
        show_youtube: data.show_youtube ?? true,
      });
    }
  };

  return (
    <main className="min-h-screen">
      <MarioCollectibles />
      <Hero />
      {visibility.show_timeline && <About />}
      {visibility.show_projects && <Projects />}
      {visibility.show_webapps && <WebApps />}
      {visibility.show_achievements && <Achievements />}
      {visibility.show_youtube && <YouTube />}
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
