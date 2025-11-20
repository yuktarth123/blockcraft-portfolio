import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent! I'll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      href: "https://linkedin.com",
      color: "hover:bg-accent/20",
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-pixel text-center mb-3 sm:mb-4 text-primary">
          Get in Touch
        </h2>
        <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-8 sm:mb-12 block-shadow" />

        <div className="max-w-2xl mx-auto">
          <Card className="p-4 sm:p-8 border-2 border-border bg-card block-shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-bold mb-2 text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-2 border-border focus:border-primary block-shadow text-sm sm:text-base"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-bold mb-2 text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-2 border-border focus:border-primary block-shadow text-sm sm:text-base"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-bold mb-2 text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="border-2 border-border focus:border-primary block-shadow resize-none text-sm sm:text-base"
                  placeholder="Tell me about your project or just say hi!"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-pixel text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground block-shadow hover:block-shadow-hover transition-all py-3"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-border">
              <p className="text-center text-xs sm:text-sm text-muted-foreground mb-4">
                Or connect with me on:
              </p>
              <div className="flex justify-center gap-3 sm:gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg border-2 border-border ${link.color} transition-all block-shadow hover:block-shadow-hover text-foreground`}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
