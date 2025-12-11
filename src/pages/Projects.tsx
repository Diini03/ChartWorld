import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import gateProduct from "@/assets/gate-product.png";
import trailers from "@/assets/trailers.png";
import steelTable from "@/assets/steel-table.png";
import industrialStructure from "@/assets/industrial-structure.png";
import agriculturalEquipment from "@/assets/agricultural-equipment.png";
import deskDesign from "@/assets/desk-design.png";

const projects = [
  { title: "Security Gates", category: "Steel Fabrication", image: gateProduct },
  { title: "Custom Trailers", category: "Manufacturing", image: trailers },
  { title: "Steel Furniture", category: "Manufacturing", image: steelTable },
  { title: "Industrial Structures", category: "Steel Fabrication", image: industrialStructure },
  { title: "Agricultural Equipment", category: "Equipment", image: agriculturalEquipment },
  { title: "Office Furniture", category: "Manufacturing", image: deskDesign },
];

const Projects = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img src={trailers} alt="Projects" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-primary-foreground pt-20">
          <p className="text-accent text-sm font-medium tracking-widest mb-4">OUR WORK</p>
          <h1 className="font-display text-4xl md:text-5xl italic">Our Projects</h1>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.title} className="group">
                <div className="overflow-hidden mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-accent text-xs font-medium tracking-widest mb-2">{project.category.toUpperCase()}</p>
                <h3 className="font-display text-xl text-foreground">{project.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src={industrialStructure} alt="Contact CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl italic mb-4">Have a Project in Mind?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Let's discuss how we can bring your vision to life.
          </p>
          <Link to="/contact" className="btn-gold inline-block">
            START A PROJECT
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
