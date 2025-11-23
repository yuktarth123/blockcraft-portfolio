import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Briefcase, GraduationCap } from "lucide-react";

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon_type: string;
}

interface TimelineCarouselProps {
  items: TimelineItem[];
}

const TimelineCarousel = ({ items }: TimelineCarouselProps) => {
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

  if (items.length <= 3) {
    return (
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((item, index) => (
          <Card 
            key={item.id} 
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
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <Card 
                className="p-6 border-2 border-border bg-card block-shadow-card hover:block-shadow-hover transition-all hover:-translate-y-1 animate-pixel-fade-in h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  {getIcon(item.icon_type)}
                </div>
                <p className="font-pixel text-xs text-accent mb-2">{item.year}</p>
                <h3 className="font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.description}</p>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default TimelineCarousel;
