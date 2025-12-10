import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Factory, Cog, GraduationCap } from "lucide-react";
import servicesCollage from "@/assets/services-collage.png";
import gateProduct from "@/assets/gate-product.png";
import trailers from "@/assets/trailers.png";
import steelTable from "@/assets/steel-table.png";

const services = [
  { icon: Wrench, title: "Steel Fabrication", description: "Custom gates, frames, and structural steel work built to your specifications." },
  { icon: Factory, title: "Manufacturing", description: "Quality furniture, trailers, and metal products for homes and businesses." },
  { icon: Cog, title: "Equipment Setup", description: "Installation and setup of industrial machinery and production lines." },
  { icon: GraduationCap, title: "Technical Training", description: "Hands-on vocational training in welding, machining, and metalwork." },
];

const featuredProducts = [
  { image: gateProduct, title: "Security Gates" },
  { image: trailers, title: "Custom Trailers" },
  { image: steelTable, title: "Steel Furniture" },
];

const Index = () => {
  return (
    <Layout>
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm font-medium text-primary">Since 2015</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Quality Steel Work & <span className="text-gradient block">Manufacturing</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">We build custom steel products, manufacture quality goods, and train the next generation of skilled workers in Mogadishu.</p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full px-8"><Link to="/services">Our Services<ArrowRight className="ml-2" size={18} /></Link></Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8"><Link to="/contact">Contact Us</Link></Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl"><img src={servicesCollage} alt="HIBER Industries Products" className="w-full h-auto" /></div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-display font-bold">9+</div>
                <div className="text-sm opacity-90">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">What We <span className="text-primary">Do</span></h2>
            <p className="text-muted-foreground">From steel fabrication to technical training, we offer comprehensive industrial solutions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.title} className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <service.icon size={24} className="text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12"><Button asChild variant="outline" className="rounded-full px-8"><Link to="/services">View All Services<ArrowRight className="ml-2" size={18} /></Link></Button></div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Our <span className="text-primary">Products</span></h2>
            <p className="text-muted-foreground">Quality craftsmanship in every project we deliver.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.title} className="group relative rounded-2xl overflow-hidden bg-card shadow-lg card-hover">
                <img src={product.image} alt={product.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6"><h3 className="font-display text-xl font-semibold text-background">{product.title}</h3></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">About <span className="text-primary">HIBER Industries</span></h2>
              <p className="text-muted-foreground leading-relaxed">Founded in 2015 in Mogadishu, HIBER Industries has grown from a small workshop into a trusted name in steel fabrication and manufacturing.</p>
              <p className="text-muted-foreground leading-relaxed">Beyond manufacturing, we're dedicated to empowering the next generation through our technical training programs.</p>
              <Button asChild variant="outline" className="rounded-full px-8"><Link to="/about">Learn More About Us<ArrowRight className="ml-2" size={18} /></Link></Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-2xl p-6 text-center"><div className="font-display text-4xl font-bold text-primary">2015</div><div className="text-muted-foreground text-sm">Established</div></div>
                <div className="bg-muted rounded-2xl p-6 text-center"><div className="font-display text-4xl font-bold text-foreground">100+</div><div className="text-muted-foreground text-sm">Projects</div></div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-muted rounded-2xl p-6 text-center"><div className="font-display text-4xl font-bold text-foreground">50+</div><div className="text-muted-foreground text-sm">Trainees</div></div>
                <div className="bg-primary rounded-2xl p-6 text-center"><div className="font-display text-4xl font-bold text-primary-foreground">4</div><div className="text-primary-foreground/90 text-sm">Services</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-foreground">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">Ready to Start Your Project?</h2>
          <p className="text-background/70 mb-8 max-w-lg mx-auto">Whether you need custom steel work, manufacturing solutions, or training programs, we're here to help.</p>
          <Button asChild size="lg" className="rounded-full px-10"><Link to="/contact">Get in Touch<ArrowRight className="ml-2" size={18} /></Link></Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;