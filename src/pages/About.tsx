import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowRight, Target, Eye, Lightbulb, Shield, Star, Users } from "lucide-react";
import trainingWorkshop from "@/assets/training-workshop.png";
import servicesCollage from "@/assets/services-collage.png";

const values = [
  { icon: Lightbulb, title: "Innovation", description: "Continuously improving our methods and exploring new solutions." },
  { icon: Shield, title: "Integrity", description: "Honest dealings and transparent practices in everything we do." },
  { icon: Star, title: "Quality", description: "Excellence in craftsmanship and attention to detail." },
  { icon: Users, title: "Empowerment", description: "Investing in people through training and development." },
];

const milestones = [
  { year: "2015", title: "Founded", description: "HIBER Industries established in Mogadishu" },
  { year: "2017", title: "Expansion", description: "Expanded workshop and added new equipment" },
  { year: "2019", title: "Training", description: "Launched technical training programs" },
  { year: "2023", title: "Growth", description: "Continued growth and community impact" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img src={servicesCollage} alt="About HIBER" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-primary-foreground pt-20">
          <p className="text-accent text-sm font-medium tracking-widest mb-4">ABOUT US</p>
          <h1 className="font-display text-4xl md:text-5xl italic">Our Story</h1>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-medium tracking-widest mb-4">WHO WE ARE</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Building Excellence Since 2015
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                HIBER Industries was founded in 2015 in Mogadishu, Somalia with a simple mission: to provide quality steel fabrication and manufacturing services while contributing to the development of our community.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What started as a small workshop has grown into a trusted industrial partner, serving businesses, organizations, and individuals across Somalia.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Today, we not only manufacture products but also invest in the future by training young Somalis in valuable technical skills.
              </p>
              <Link to="/services" className="gold-link">
                VIEW OUR SERVICES <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              <img src={trainingWorkshop} alt="HIBER Workshop" className="w-full h-96 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-2">
            <div className="navy-box flex flex-col">
              <Eye size={40} className="text-accent mb-6" strokeWidth={1} />
              <h3 className="font-display text-2xl md:text-3xl mb-4">Our Vision</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To be a leading industrial company in Somalia, known for quality products, innovative solutions, and our contribution to workforce development.
              </p>
            </div>
            <div className="navy-box bg-primary/90 flex flex-col">
              <Target size={40} className="text-accent mb-6" strokeWidth={1} />
              <h3 className="font-display text-2xl md:text-3xl mb-4">Our Mission</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                To deliver quality steel fabrication and manufacturing services while empowering communities through technical education and sustainable employment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-widest mb-4">OUR PRINCIPLES</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-background border border-primary p-6 text-center">
                <value.icon size={40} className="text-accent mx-auto mb-4" strokeWidth={1} />
                <h3 className="font-display text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-widest mb-4">OUR HISTORY</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Our Journey</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative flex gap-8 pb-12 last:pb-0">
                  <div className="w-16 h-16 bg-primary flex items-center justify-center shrink-0 z-10">
                    <span className="font-display text-lg text-primary-foreground">{milestone.year.slice(-2)}</span>
                  </div>
                  <div className="pt-3">
                    <p className="text-accent text-xs font-medium tracking-widest mb-1">{milestone.year}</p>
                    <h3 className="font-display text-xl text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
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
          <h2 className="font-display text-3xl md:text-4xl italic mb-4">Want to Work With Us?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Let's discuss how we can help with your project.
          </p>
          <Link to="/contact" className="btn-gold inline-block">
            CONTACT US
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default About;
