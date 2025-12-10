import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-transparent.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="HIBER Industries" className="h-14 w-auto" />
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              Building Somalia's industrial future through innovation, quality steel fabrication, and workforce development.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Services", "Training", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-xl mb-4 text-primary">Our Services</h4>
            <ul className="space-y-2">
              {[
                "Steel Fabrication",
                "Manufacturing",
                "Machinery Installation",
                "Innovation Solutions",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-xl mb-4 text-primary">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-secondary-foreground/70 text-sm">
                  Mogadishu, Somalia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a
                  href="tel:+252XXXXXXX"
                  className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  +252 XXX XXX XXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a
                  href="mailto:info@hiberindustries.com"
                  className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  info@hiberindustries.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/50 text-sm">
              © {new Date().getFullYear()} HIBER Industries. All rights reserved.
            </p>
            <p className="text-secondary-foreground/50 text-sm">
              Engineering Excellence Since 2015
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
