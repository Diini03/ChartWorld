import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logoTransparent from "@/assets/logo-transparent.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <img src={logoTransparent} alt="HIBER Industries" className="h-16 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Quality steel fabrication, manufacturing, and technical training since 2015.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Projects", path: "/projects" },
                { name: "Training", path: "/training" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">Mogadishu, Somalia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <a href="tel:+252XXXXXXX" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  +252 XXX XXXXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <a href="mailto:info@hiberindustries.com" className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                  info@hiberindustries.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-display text-lg mb-6">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-primary-foreground/30 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} HIBER Industries. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
