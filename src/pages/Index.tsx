import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowRight, Wrench, Factory, Cog, GraduationCap, Shield, Lightbulb, Users, Star, Heart, MessageCircle } from "lucide-react";
import servicesCollage from "@/assets/services-collage.png";
import gateProduct from "@/assets/gate-product.png";
import trailers from "@/assets/trailers.png";

const services = [
  { icon: Wrench, title: "Steel Fabrication" },
  { icon: Factory, title: "Manufacturing" },
  { icon: Cog, title: "Equipment Installation" },
  { icon: GraduationCap, title: "Technical Training" },
  { icon: Shield, title: "Maintenance & Repair" },
  { icon: Lightbulb, title: "Custom Design" },
];

const values = [
  { icon: Shield, title: "Safety", description: "Prioritizing safety in all operations" },
  { icon: Star, title: "Quality", description: "Excellence in every product" },
  { icon: Users, title: "Community", description: "Empowering local workforce" },
  { icon: Heart, title: "Integrity", description: "Honest and transparent dealings" },
  { icon: Lightbulb, title: "Innovation", description: "Continuous improvement" },
  { icon: MessageCircle, title: "Service", description: "Customer-focused approach" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={servicesCollage} alt="HIBER Industries" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-center text-primary-foreground pt-20">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal italic mb-8 max-w-4xl mx-auto leading-tight">
            Quality Steel Work,<br />Lasting Solutions.
          </h1>
          <Link to="/services" className="btn-gold inline-block">
            EXPLORE
          </Link>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-medium tracking-widest mb-4">OUR STORY</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Building Excellence Since 2015
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in Mogadishu, HIBER Industries has grown from a small workshop into a trusted name in steel fabrication and manufacturing. We combine traditional craftsmanship with modern techniques to deliver quality products.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Beyond manufacturing, we're dedicated to empowering the next generation through our technical training programs, creating sustainable employment opportunities for young Somalis.
              </p>
              <Link to="/about" className="gold-link">
                LEARN MORE <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              <img src={gateProduct} alt="Our Work" className="w-full h-96 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2">
            <div className="navy-box">
              <h3 className="font-display text-2xl md:text-3xl mb-4">Our Vision</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To be a leading industrial company in Somalia, known for quality products, innovative solutions, and our contribution to workforce development.
              </p>
            </div>
            <div className="navy-box bg-primary/90">
              <h3 className="font-display text-2xl md:text-3xl mb-4">Our Mission</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To deliver quality steel fabrication and manufacturing services while empowering communities through technical education and sustainable employment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-widest mb-4">WHAT WE DO</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Our Services</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
            {services.map((service) => (
              <div key={service.title} className="service-card bg-background">
                <service.icon size={40} className="text-accent mx-auto mb-4" strokeWidth={1} />
                <h3 className="font-display text-lg text-foreground">{service.title}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="btn-gold inline-block">
              SEE MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src={trailers} alt="Featured Project" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="container-custom relative z-10 text-primary-foreground">
          <p className="text-accent text-sm font-medium tracking-widest mb-4">OUR PROJECTS</p>
          <h2 className="font-display text-3xl md:text-4xl italic mb-8 max-w-2xl">
            Custom Trailers & Transport Solutions
          </h2>
          <Link to="/projects" className="btn-white inline-block">
            SEE ALL PROJECTS
          </Link>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-widest mb-4">OUR PRINCIPLES</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Core Values</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="border border-primary p-6 text-center">
                <value.icon size={32} className="text-accent mx-auto mb-3" strokeWidth={1} />
                <h3 className="font-display text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src={servicesCollage} alt="Contact CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl italic mb-8 max-w-3xl mx-auto">
            Explore the limitless possibilities with HIBER Industries!
          </h2>
          <Link to="/contact" className="btn-gold inline-block">
            CONTACT US
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
