import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import WebApps from "@/components/WebApps";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <WebApps />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
