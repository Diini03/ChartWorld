import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import gateProduct from "@/assets/gate-product.png";
import trailers from "@/assets/trailers.png";
import steelTable from "@/assets/steel-table.png";
import industrialStructure from "@/assets/industrial-structure.png";
import agriculturalEquipment from "@/assets/agricultural-equipment.png";
import deskDesign from "@/assets/desk-design.png";

const services = [
  {
    title: "Steel Fabrication",
    description: "Custom steel structures and products built to your specifications using quality materials and skilled craftsmanship.",
    features: [
      "Security gates and doors",
      "Structural steel frames",
      "Window and door grilles",
      "Fencing and barriers",
      "Custom metalwork",
      "Repair services",
    ],
    images: [gateProduct, industrialStructure],
  },
  {
    title: "Manufacturing",
    description: "Quality products for homes and businesses, designed and built in our Mogadishu workshop.",
    features: [
      "Steel furniture (tables, desks, chairs)",
      "Trailers and carts",
      "Storage containers",
      "Metal shelving units",
      "Custom product design",
      "Bulk orders available",
    ],
    images: [trailers, steelTable, deskDesign],
  },
  {
    title: "Equipment Installation",
    description: "Professional setup of industrial machinery and production equipment for businesses and factories.",
    features: [
      "Factory equipment setup",
      "Production line installation",
      "Machinery maintenance",
      "Technical consultation",
      "Equipment repair",
    ],
    images: [agriculturalEquipment],
  },
];

const clients = [
  "Construction Companies",
  "Businesses",
  "NGOs & Aid Organizations",
  "Government Agencies",
  "Hotels & Restaurants",
  "Farms & Agriculture",
  "Private Homes",
  "Schools & Institutions",
];

const Services = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-sm font-medium text-primary">Our Services</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              What We <span className="text-primary">Build</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Quality steel fabrication and manufacturing services for businesses and individuals.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
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
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="rounded-full px-8">
                    <Link to="/contact">
                      Get a Quote
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </Button>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className={`grid ${service.images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                    {service.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${service.title} example ${imgIndex + 1}`}
                        className={`rounded-2xl shadow-lg w-full object-cover ${
                          service.images.length > 2 && imgIndex === 2 ? "col-span-2" : ""
                        } ${service.images.length === 1 ? "h-80" : "h-48"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Who We <span className="text-primary">Serve</span>
            </h2>
            <p className="text-muted-foreground">
              We work with a variety of clients across different sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clients.map((client) => (
              <div
                key={client}
                className="bg-card p-5 rounded-xl border border-border text-center hover:border-primary/50 transition-colors"
              >
                <span className="text-foreground font-medium text-sm">{client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-background/70 mb-8 max-w-lg mx-auto">
            Tell us about your project and we'll provide a quote.
          </p>
          <Button asChild size="lg" className="rounded-full px-10">
            <Link to="/contact">
              Contact Us
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
