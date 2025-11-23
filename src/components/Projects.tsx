import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order");
    if (data) setProjects(data);
  };

  return (
    <section id="projects" className="py-12 sm:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-pixel text-center mb-3 sm:mb-4 text-primary">
          Product Work
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-8 sm:mb-12 block-shadow" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`p-4 sm:p-6 border-2 ${project.color} block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-2 animate-pixel-fade-in cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-primary transition-colors" />
              </div>

              <h3 className="font-bold text-lg sm:text-xl mb-2 text-foreground">{project.title}</h3>
              <p className="text-xs font-pixel text-accent mb-2 sm:mb-3">{project.role}</p>
              <p className="text-xs sm:text-sm text-foreground/80 mb-3 sm:mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-background/50 rounded text-xs sm:text-sm font-bold text-primary block-shadow"
                  >
                    {metric}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
