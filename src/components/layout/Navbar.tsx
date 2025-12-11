import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoTransparent from "@/assets/logo-transparent.png";

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "SERVICES", path: "/services" },
  { name: "PROJECTS", path: "/projects" },
  { name: "TRAINING", path: "/training" },
  { name: "CONTACT", path: "/contact" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background shadow-sm" : "bg-transparent"}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logoTransparent} alt="HIBER Industries" className="h-14 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium tracking-widest transition-colors relative ${
                  location.pathname === link.path
                    ? "text-accent"
                    : scrolled ? "text-foreground hover:text-accent" : "text-primary-foreground hover:text-accent"
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />
                )}
              </Link>
            ))}
          </div>
          
          <button
            className={`md:hidden p-2 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg">
            <div className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-xs font-medium tracking-widest transition-colors ${
                    location.pathname === link.path
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
