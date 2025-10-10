import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Lightbulb } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "EdTech Platform Redesign",
      role: "Lead Product Manager",
      description: "Redesigned the core user experience for 500K+ active learners, resulting in 40% increase in engagement.",
      metrics: ["40% ↑ Engagement", "25% ↑ Retention", "500K+ Users"],
      tags: ["UX Research", "A/B Testing", "Analytics"],
      color: "bg-primary/10 border-primary",
    },
    {
      title: "AI-Powered Recommendation Engine",
      role: "Product Manager",
      description: "Built personalized content recommendation system using ML algorithms to boost user satisfaction.",
      metrics: ["60% ↑ CTR", "35% ↑ Time on Platform"],
      tags: ["Machine Learning", "Data Science", "Personalization"],
      color: "bg-accent/10 border-accent",
    },
    {
      title: "Mobile App Launch",
      role: "Product Owner",
      description: "Led cross-functional team to launch mobile app from 0 to 1, achieving 100K downloads in first month.",
      metrics: ["100K Downloads", "4.8★ Rating", "Launch in 3 Markets"],
      tags: ["Mobile", "Go-to-Market", "Agile"],
      color: "bg-secondary/10 border-secondary",
    },
  ];

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
