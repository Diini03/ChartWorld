import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Wrench, Cog, Ruler, Zap } from "lucide-react";
import trainingWorkshop from "@/assets/training-workshop.png";

const courses = [
  { icon: Wrench, title: "Welding", duration: "3-6 months", description: "Learn arc welding, MIG welding, and metal joining techniques." },
  { icon: Cog, title: "Machining", duration: "3-6 months", description: "Operate lathes, drills, and other workshop machinery." },
  { icon: Ruler, title: "Metal Fabrication", duration: "3-6 months", description: "Cut, shape, and assemble metal components and structures." },
  { icon: Zap, title: "Basic Electrical", duration: "2-4 months", description: "Fundamentals of electrical wiring and equipment maintenance." },
];

const benefits = ["Hands-on training in a real workshop", "Learn from experienced engineers", "Work on actual projects", "Gain job-ready skills", "Certificate upon completion", "Job placement assistance"];

const Training = () => {
  return (
    <Layout>
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"><span className="text-sm font-medium text-primary">Technical Training</span></div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Learn Practical <span className="text-primary">Skills</span></h1>
              <p className="text-lg text-muted-foreground mb-8">Our vocational training programs help young Somalis develop valuable technical skills for sustainable careers.</p>
              <Button asChild size="lg" className="rounded-full px-8"><Link to="/contact">Inquire About Training<ArrowRight className="ml-2" size={18} /></Link></Button>
            </div>
            <div className="relative"><img src={trainingWorkshop} alt="Training at HIBER" className="rounded-2xl shadow-xl w-full" /></div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Why Train With <span className="text-primary">Us?</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-6">We believe in learning by doing. Our training programs take place in our actual workshop, where trainees work alongside our experienced team on real projects.</p>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span className="text-muted-foreground">{benefit}</span></li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-2xl p-8 text-center"><div className="font-display text-5xl font-bold text-primary mb-2">50+</div><div className="text-muted-foreground">Graduates</div></div>
              <div className="bg-muted rounded-2xl p-8 text-center"><div className="font-display text-5xl font-bold text-foreground mb-2">4</div><div className="text-muted-foreground">Programs</div></div>
              <div className="bg-muted rounded-2xl p-8 text-center"><div className="font-display text-5xl font-bold text-foreground mb-2">3-6</div><div className="text-muted-foreground">Months</div></div>
              <div className="bg-primary rounded-2xl p-8 text-center"><div className="font-display text-5xl font-bold text-primary-foreground mb-2">100%</div><div className="text-primary-foreground/80">Practical</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Training <span className="text-primary">Programs</span></h2>
            <p className="text-muted-foreground">Choose from our range of practical vocational courses.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.title} className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4"><course.icon className="text-primary" size={24} /></div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{course.title}</h3>
                <div className="inline-block px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground mb-3">{course.duration}</div>
                <p className="text-muted-foreground text-sm">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Who Can <span className="text-primary">Apply?</span></h2>
            <p className="text-muted-foreground mb-8">Our programs are open to young Somalis looking to develop practical skills. No prior experience required.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["Youth ages 16-35", "No experience needed", "Basic literacy required", "Commitment to complete"].map((item) => (
                <span key={item} className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">{item}</span>
              ))}
            </div>
            <Button asChild size="lg" className="rounded-full px-10"><Link to="/contact">Apply Now<ArrowRight className="ml-2" size={18} /></Link></Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-foreground">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">Ready to Start Learning?</h2>
          <p className="text-background/70 mb-8 max-w-lg mx-auto">Contact us to learn more about our training programs.</p>
          <Button asChild size="lg" className="rounded-full px-10"><Link to="/contact">Contact Us<ArrowRight className="ml-2" size={18} /></Link></Button>
        </div>
      </section>
    </Layout>
  );
};

export default Training;