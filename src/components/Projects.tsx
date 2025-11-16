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
    <section id="projects" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-pixel text-center mb-4 text-primary">
          Product Work
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 block-shadow" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`p-6 border-2 ${project.color} block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-2 animate-pixel-fade-in cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
                <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
              </div>

              <h3 className="font-bold text-xl mb-2 text-foreground">{project.title}</h3>
              <p className="text-xs font-pixel text-accent mb-3">{project.role}</p>
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="space-y-3 mb-4">
                {project.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 bg-background/50 rounded text-sm font-bold text-primary block-shadow"
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
