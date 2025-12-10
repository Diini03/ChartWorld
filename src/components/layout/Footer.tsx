import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logoTransparent from "@/assets/logo-transparent.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <img src={logoTransparent} alt="HIBER Industries" className="h-12 w-auto brightness-0 invert" />
            <p className="text-background/70 text-sm leading-relaxed">Steel fabrication, manufacturing, and technical training. Building quality products since 2015.</p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }, { name: "Services", path: "/services" }, { name: "Training", path: "/training" }, { name: "Contact", path: "/contact" }].map((link) => (
                <li key={link.path}><Link to={link.path} className="text-background/70 hover:text-primary transition-colors text-sm">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {["Steel Fabrication", "Manufacturing", "Equipment Installation", "Technical Training"].map((service) => (
                <li key={service}><span className="text-background/70 text-sm">{service}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-primary shrink-0 mt-0.5" /><span className="text-background/70 text-sm">Mogadishu, Somalia</span></li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-primary shrink-0" /><a href="tel:+252XXXXXXX" className="text-background/70 hover:text-primary transition-colors text-sm">+252 XXX XXXXX</a></li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-primary shrink-0" /><a href="mailto:info@hiberindustries.com" className="text-background/70 hover:text-primary transition-colors text-sm">info@hiberindustries.com</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">© {new Date().getFullYear()} HIBER Industries. All rights reserved.</p>
          <p className="text-background/50 text-sm">Established 2015 • Mogadishu, Somalia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;