import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  message: z.string().min(1, "Message is required").max(1000),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [socialLinks, setSocialLinks] = useState([
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      href: "mailto:contact@yuktarth.com",
      color: "hover:bg-accent/20",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      href: "https://linkedin.com",
      color: "hover:bg-accent/20",
    },
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      href: "https://github.com",
      color: "hover:bg-accent/20",
    },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profile_content")
        .select("email, linkedin_url, github_url")
        .limit(1)
        .maybeSingle();

      if (data) {
        setSocialLinks([
          {
            icon: <Mail className="w-5 h-5" />,
            label: "Email",
            href: `mailto:${data.email || "contact@yuktarth.com"}`,
            color: "hover:bg-accent/20",
          },
          {
            icon: <Linkedin className="w-5 h-5" />,
            label: "LinkedIn",
            href: data.linkedin_url || "https://linkedin.com",
            color: "hover:bg-accent/20",
          },
          {
            icon: <Github className="w-5 h-5" />,
            label: "GitHub",
            href: data.github_url || "https://github.com",
            color: "hover:bg-accent/20",
          },
        ]);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-pixel text-center mb-4 text-primary">
          Get in Touch
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12 block-shadow" />

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 border-2 border-border bg-card block-shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2 text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border-2 border-border focus:border-primary block-shadow"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2 text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-2 border-border focus:border-primary block-shadow"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2 text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="border-2 border-border focus:border-primary block-shadow resize-none"
                  placeholder="Tell me about your project or just say hi!"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-pixel text-xs bg-primary hover:bg-primary/90 text-primary-foreground block-shadow hover:block-shadow-hover transition-all"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t-2 border-border">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Or connect with me on:
              </p>
              <div className="flex justify-center gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 border-border ${link.color} transition-all block-shadow hover:block-shadow-hover text-foreground`}
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
