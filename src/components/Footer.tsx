const Footer = () => {
  return (
    <footer className="py-8 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="font-pixel text-xs mb-2">
            Yuktarth Nagar
          </p>
          <p className="text-sm opacity-80">
            Crafting Digital Experiences, One Block at a Time
          </p>
          <p className="text-xs mt-4 opacity-60">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
