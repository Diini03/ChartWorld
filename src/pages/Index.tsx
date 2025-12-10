import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Factory, Cog, Lightbulb, Users, Award, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";

const stats = [
  { icon: Clock, value: "10+", label: "Years Experience" },
  { icon: Factory, value: "500+", label: "Projects Completed" },
  { icon: Users, value: "200+", label: "Trainees Graduated" },
  { icon: Award, value: "100%", label: "Quality Commitment" },
];

const services = [
  {
    icon: Wrench,
    title: "Steel Fabrication",
    description: "Custom steel structures, gates, frames, and industrial components built to international standards.",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Production of domestic and commercial products including furniture, water tanks, and containers.",
  },
  {
    icon: Cog,
    title: "Machinery Installation",
    description: "Industrial equipment installation and production line setup for factories and processing plants.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Solutions",
    description: "Technology integration and R&D for improved industrial processes and sustainable solutions.",
  },
];

const clients = [
  "UN Agencies",
  "INGOs",
  "Government Institutions",
  "Local Businesses",
  "Construction Companies",
  "Agricultural Sector",
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-sm font-medium">Engineering Excellence Since 2015</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-secondary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              BUILDING SOMALIA'S{" "}
              <span className="text-primary">INDUSTRIAL</span> FUTURE
            </h1>
            
            <p className="text-lg md:text-xl text-secondary-foreground/70 mb-8 max-w-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Leading steel fabrication, manufacturing, and industrial innovation company empowering local industries and developing skilled workforce.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild size="lg" className="bg-primary hover:bg-copper-dark text-primary-foreground">
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background relative -mt-12 z-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card p-6 rounded-lg shadow-card text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-display text-4xl text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              OUR <span className="text-primary">SERVICES</span>
            </h2>
            <p className="text-muted-foreground">
              Comprehensive industrial solutions tailored to meet the growing demands of Somalia's economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group bg-card p-6 rounded-lg shadow-card card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <Link
                  to="/services"
                  className="inline-flex items-center text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                  Learn More <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-secondary-foreground mb-6">
                WHY CHOOSE <span className="text-primary">HIBER?</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Local Expertise", desc: "Deep understanding of Somalia's industrial needs and challenges." },
                  { title: "Quality Standards", desc: "International quality materials and engineering practices." },
                  { title: "Skilled Workforce", desc: "Trained professionals delivering excellence in every project." },
                  { title: "Innovation Focus", desc: "Continuous improvement and technology integration." },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-1 bg-primary rounded-full" />
                    <div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">{item.title}</h4>
                      <p className="text-secondary-foreground/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80"
                alt="Industrial welding"
                className="rounded-lg shadow-elevated"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-lg shadow-glow">
                <div className="font-display text-4xl text-primary-foreground">10+</div>
                <div className="text-primary-foreground/80 text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              TRUSTED <span className="text-primary">PARTNERS</span>
            </h2>
            <p className="text-muted-foreground">
              Working with leading organizations to build a stronger industrial foundation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client, index) => (
              <div
                key={client}
                className="bg-card p-6 rounded-lg shadow-card text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-muted-foreground text-sm font-medium">{client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom text-center">
          <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mb-4">
            READY TO START YOUR PROJECT?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Let's discuss how HIBER Industries can bring your industrial vision to life.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90">
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
