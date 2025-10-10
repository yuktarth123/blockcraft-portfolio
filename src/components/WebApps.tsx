import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, Github, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const WebApps = () => {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase
        .from("web_apps")
        .select("*")
        .eq("is_published", true)
        .order("display_order");

      if (data) {
        setApps(data);
      }
    };

    fetchApps();
  }, []);

  return (
    <section id="apps" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-pixel text-center mb-4 text-primary">
          Web Apps Gallery
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 block-shadow" />

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {apps.map((app, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-border bg-card block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-1 animate-pixel-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Code2 className="w-6 h-6 text-primary" />
              </div>

              <h3 className="font-bold text-xl mb-2 text-foreground">{app.name}</h3>
              <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                {app.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {app.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-muted text-xs rounded font-mono text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {app.demo_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-2 text-xs font-pixel"
                    asChild
                  >
                    <a href={app.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Demo
                    </a>
                  </Button>
                )}
                {app.github_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-2 text-xs font-pixel"
                    asChild
                  >
                    <a href={app.github_url} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3 mr-2" />
                      Code
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WebApps;
