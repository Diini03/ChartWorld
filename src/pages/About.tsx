import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Lightbulb, Shield, Star, Users } from "lucide-react";
import trainingWorkshop from "@/assets/training-workshop.png";

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
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"><span className="text-sm font-medium text-primary">About Us</span></div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Building Quality, <span className="text-primary">Empowering People</span></h1>
            <p className="text-lg text-muted-foreground">Since 2015, we've been committed to quality manufacturing and developing skilled workers in Somalia.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our <span className="text-primary">Story</span></h2>
              <p className="text-muted-foreground leading-relaxed">HIBER Industries was founded in 2015 in Mogadishu, Somalia with a simple mission: to provide quality steel fabrication and manufacturing services while contributing to the development of our community.</p>
              <p className="text-muted-foreground leading-relaxed">What started as a small workshop has grown into a trusted industrial partner, serving businesses, organizations, and individuals across Somalia.</p>
              <p className="text-muted-foreground leading-relaxed">Today, we not only manufacture products but also invest in the future by training young Somalis in valuable technical skills.</p>
            </div>
            <div className="relative">
              <img src={trainingWorkshop} alt="HIBER Workshop" className="rounded-2xl shadow-xl w-full" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/30 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6"><Eye className="text-primary" size={24} /></div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">To be a leading industrial company in Somalia, known for quality products, innovative solutions, and our contribution to workforce development.</p>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6"><Target className="text-primary" size={24} /></div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">To deliver quality steel fabrication and manufacturing services while empowering communities through technical education and sustainable employment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Our <span className="text-primary">Values</span></h2>
            <p className="text-muted-foreground">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4"><value.icon className="text-primary" size={24} /></div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Our <span className="text-primary">Journey</span></h2></div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative flex gap-8 pb-12 last:pb-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shrink-0 z-10"><span className="font-display text-lg font-bold text-primary-foreground">{milestone.year.slice(-2)}</span></div>
                  <div className="pt-3">
                    <div className="text-sm text-primary font-medium mb-1">{milestone.year}</div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-foreground">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">Want to Work With Us?</h2>
          <p className="text-background/70 mb-8 max-w-lg mx-auto">Let's discuss how we can help with your project.</p>
          <Button asChild size="lg" className="rounded-full px-10"><Link to="/contact">Contact Us<ArrowRight className="ml-2" size={18} /></Link></Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;