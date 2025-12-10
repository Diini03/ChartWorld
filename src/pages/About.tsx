import Layout from "@/components/layout/Layout";
import { Target, Eye, Heart, Zap, Shield, Leaf } from "lucide-react";

const values = [
  { icon: Zap, title: "Innovation", description: "Embracing new technologies and methods to improve industrial processes." },
  { icon: Shield, title: "Integrity", description: "Operating with honesty, transparency, and ethical business practices." },
  { icon: Target, title: "Quality", description: "Delivering products and services that meet international standards." },
  { icon: Heart, title: "Empowerment", description: "Investing in local talent and creating opportunities for growth." },
  { icon: Leaf, title: "Sustainability", description: "Committed to environmentally responsible manufacturing practices." },
];

const milestones = [
  { year: "2015", title: "Founded", description: "HIBER Industries established in Mogadishu" },
  { year: "2017", title: "Expansion", description: "Opened manufacturing facility and training center" },
  { year: "2019", title: "Growth", description: "Partnerships with UN agencies and international NGOs" },
  { year: "2021", title: "Innovation", description: "Launched R&D division for industrial solutions" },
  { year: "2024", title: "Today", description: "Leading industrial company in Somalia" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-7xl text-secondary-foreground mb-6 animate-fade-in">
              ABOUT <span className="text-primary">HIBER</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/70 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Since 2015, we've been at the forefront of Somalia's industrial development, combining engineering excellence with a commitment to local empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                OUR <span className="text-primary">STORY</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2015, HIBER Industries emerged from a vision to transform Somalia's industrial landscape. We recognized the critical need for quality steel fabrication, local manufacturing capabilities, and skilled workforce development.
                </p>
                <p>
                  What started as a modest workshop has grown into a comprehensive industrial enterprise, serving clients across sectors from construction to agriculture, from humanitarian organizations to government institutions.
                </p>
                <p>
                  Today, HIBER Industries stands as a testament to what's possible when innovation meets determination. We continue to push boundaries, invest in our people, and contribute to Somalia's economic growth.
                </p>
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80"
                alt="HIBER Workshop"
                className="rounded-lg shadow-elevated"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-lg" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 md:p-12 rounded-lg shadow-card animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-3xl text-foreground mb-4">OUR VISION</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading industrial company in the Horn of Africa, known for innovation, quality, and commitment to sustainable development.
              </p>
            </div>
            <div className="bg-secondary p-8 md:p-12 rounded-lg shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-3xl text-secondary-foreground mb-4">OUR MISSION</h3>
              <p className="text-secondary-foreground/70 leading-relaxed">
                To provide innovative industrial solutions while developing local expertise, creating jobs, and contributing to the economic growth of Somalia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              OUR <span className="text-primary">VALUES</span>
            </h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do at HIBER Industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group bg-card p-6 rounded-lg shadow-card card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <value.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-secondary-foreground mb-4">
              OUR <span className="text-primary">JOURNEY</span>
            </h2>
            <p className="text-secondary-foreground/70">
              Key milestones in HIBER Industries' growth story.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center gap-8 animate-fade-in ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-navy-light p-6 rounded-lg inline-block">
                      <div className="font-display text-3xl text-primary mb-1">{milestone.year}</div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">{milestone.title}</h4>
                      <p className="text-secondary-foreground/70 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 shadow-glow" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
