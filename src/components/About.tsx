import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap, Trophy } from "lucide-react";

const About = () => {
  const timeline = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      year: "2023 - Present",
      title: "Senior Product Manager",
      description: "Leading product strategy and execution for innovative digital solutions.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      year: "2021 - 2023",
      title: "Product Manager",
      description: "Managed cross-functional teams to deliver user-centric products.",
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      year: "2017 - 2021",
      title: "Education & Foundation",
      description: "Built foundational knowledge in product development and user experience.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-pixel text-center mb-4 text-primary">
          About Me
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 block-shadow" />
        
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-lg text-center text-foreground/80 leading-relaxed">
            I'm a Product Manager passionate about building digital experiences that solve real problems. 
            My approach combines strategic thinking with hands-on execution, treating each project like 
            crafting in Minecraft—starting with a vision and building it block by block.
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
                {item.icon}
              </div>
              <p className="font-pixel text-xs text-accent mb-2">{item.year}</p>
              <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
              <p className="text-sm text-foreground/70">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="#" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-pixel text-xs rounded block-shadow hover:block-shadow-hover transition-all hover:-translate-y-1"
          >
            <Trophy className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
