import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Wrench, Factory, Cog, Lightbulb, ArrowRight, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Wrench,
    title: "Steel Fabrication & Engineering",
    description: "Custom steel structures and components built to international standards using quality materials and skilled craftsmanship.",
    features: [
      "Structural steel frames and beams",
      "Gates, doors, and security barriers",
      "Industrial tanks and containers",
      "Custom metalwork and welding",
      "Reinforcement for construction projects",
      "Repair and maintenance services",
    ],
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80",
  },
  {
    icon: Factory,
    title: "Manufacturing Solutions",
    description: "Production of high-quality domestic and commercial products designed for the local market's needs.",
    features: [
      "Metal furniture and fixtures",
      "Water tanks and storage solutions",
      "Industrial containers and bins",
      "Agricultural equipment",
      "Construction materials",
      "Custom product development",
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  },
  {
    icon: Cog,
    title: "Machinery & Production Lines",
    description: "Expert installation and setup of industrial equipment to optimize your manufacturing operations.",
    features: [
      "Factory equipment installation",
      "Production line setup",
      "Industrial automation",
      "Equipment maintenance",
      "Technical consultation",
      "Process optimization",
    ],
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Technology",
    description: "Cutting-edge solutions and R&D services to drive industrial advancement and sustainability.",
    features: [
      "Process improvement consulting",
      "Sustainable manufacturing solutions",
      "Technology integration",
      "Product innovation and design",
      "Research and development",
      "Energy efficiency solutions",
    ],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-7xl text-secondary-foreground mb-6 animate-fade-in">
              OUR <span className="text-primary">SERVICES</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/70 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Comprehensive industrial solutions from steel fabrication to innovation consulting, tailored to meet your specific needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`${index % 2 === 1 ? "lg:order-2" : ""} animate-fade-in`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="h-0.5 w-12 bg-primary" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="bg-primary hover:bg-copper-dark">
                    <Link to="/contact">
                      Request a Quote
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""} relative animate-fade-in`} style={{ animationDelay: "0.1s" }}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-lg shadow-elevated w-full h-80 object-cover"
                  />
                  <div className={`absolute ${index % 2 === 0 ? "-bottom-4 -right-4" : "-bottom-4 -left-4"} w-full h-full border-2 border-primary/30 rounded-lg -z-10`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              INDUSTRIES WE <span className="text-primary">SERVE</span>
            </h2>
            <p className="text-muted-foreground">
              Our expertise spans across multiple sectors, delivering tailored solutions for diverse industrial needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Construction",
              "Agriculture",
              "Humanitarian",
              "Government",
              "Manufacturing",
              "Energy",
              "Transportation",
              "Hospitality",
            ].map((industry, index) => (
              <div
                key={industry}
                className="bg-card p-6 rounded-lg shadow-card text-center card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="font-medium text-foreground">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary">
        <div className="container-custom text-center">
          <h2 className="font-display text-4xl md:text-5xl text-secondary-foreground mb-4">
            NEED A CUSTOM <span className="text-primary">SOLUTION?</span>
          </h2>
          <p className="text-secondary-foreground/70 mb-8 max-w-xl mx-auto">
            Our team of engineers and specialists are ready to discuss your project requirements.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-copper-dark">
            <Link to="/contact">
              Contact Our Team
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
