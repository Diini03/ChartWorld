import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowRight } from "lucide-react";
import gateProduct from "@/assets/gate-product.png";
import trailers from "@/assets/trailers.png";
import industrialStructure from "@/assets/industrial-structure.png";
import trainingWorkshop from "@/assets/training-workshop.png";

const services = [
  {
    title: "Steel Fabrication",
    description: "Custom gates, frames, structural steel, and metalwork built to your exact specifications using quality materials.",
    image: gateProduct,
  },
  {
    title: "Manufacturing",
    description: "Quality furniture, trailers, storage solutions, and metal products for homes and businesses.",
    image: trailers,
  },
  {
    title: "Equipment Installation",
    description: "Professional setup and installation of industrial machinery, production lines, and factory equipment.",
    image: industrialStructure,
  },
  {
    title: "Technical Training",
    description: "Hands-on vocational training programs in welding, machining, and metal fabrication for young Somalis.",
    image: trainingWorkshop,
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img src={industrialStructure} alt="Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-primary-foreground pt-20">
          <p className="text-accent text-sm font-medium tracking-widest mb-4">SERVICES</p>
          <h1 className="font-display text-4xl md:text-5xl italic">What We Do</h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.title} className="group">
                <div className="overflow-hidden mb-6">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <Link to="/contact" className="gold-link">
                  LEARN MORE <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src={gateProduct} alt="Contact CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl italic mb-4">Need a Custom Solution?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Tell us about your project and we'll provide a detailed quote.
          </p>
          <Link to="/contact" className="btn-gold inline-block">
            GET A QUOTE
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
