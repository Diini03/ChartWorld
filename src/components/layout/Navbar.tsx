import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoTransparent from "@/assets/logo-transparent.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Training", path: "/training" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logoTransparent} alt="HIBER Industries" className="h-12 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === link.path ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:block">
            <Button asChild className="rounded-full px-6"><Link to="/contact">Get a Quote</Link></Button>
          </div>
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg animate-fade-in">
            <div className="container-custom py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === link.path ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`}>{link.name}</Link>
              ))}
              <div className="pt-2"><Button asChild className="w-full rounded-full"><Link to="/contact" onClick={() => setIsOpen(false)}>Get a Quote</Link></Button></div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;