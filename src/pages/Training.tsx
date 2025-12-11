import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowRight, CheckCircle, Wrench, Cog, Ruler, Zap } from "lucide-react";
import trainingWorkshop from "@/assets/training-workshop.png";

const courses = [
  { icon: Wrench, title: "Welding", duration: "3-6 months", description: "Arc welding, MIG welding, and metal joining techniques." },
  { icon: Cog, title: "Machining", duration: "3-6 months", description: "Operate lathes, drills, and workshop machinery." },
  { icon: Ruler, title: "Metal Fabrication", duration: "3-6 months", description: "Cut, shape, and assemble metal components." },
  { icon: Zap, title: "Basic Electrical", duration: "2-4 months", description: "Electrical wiring and equipment maintenance." },
];

const benefits = [
  "Hands-on training in a real workshop",
  "Learn from experienced engineers",
  "Work on actual projects",
  "Gain job-ready skills",
  "Certificate upon completion",
  "Job placement assistance",
];

const Training = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img src={trainingWorkshop} alt="Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-primary-foreground pt-20">
          <p className="text-accent text-sm font-medium tracking-widest mb-4">TRAINING</p>
          <h1 className="font-display text-4xl md:text-5xl italic">TVET Programs</h1>
        </div>
      </section>

      {/* About Training */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-medium tracking-widest mb-4">WHY TRAIN WITH US</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Learn Practical Skills
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our vocational training programs help young Somalis develop valuable technical skills for sustainable careers. We believe in learning by doing.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="gold-link">
                INQUIRE NOW <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-primary-foreground p-6 text-center">
                <div className="font-display text-4xl mb-2">50+</div>
                <div className="text-primary-foreground/80 text-sm">Graduates</div>
              </div>
              <div className="bg-muted p-6 text-center">
                <div className="font-display text-4xl text-foreground mb-2">4</div>
                <div className="text-muted-foreground text-sm">Programs</div>
              </div>
              <div className="bg-muted p-6 text-center">
                <div className="font-display text-4xl text-foreground mb-2">3-6</div>
                <div className="text-muted-foreground text-sm">Months</div>
              </div>
              <div className="bg-accent text-accent-foreground p-6 text-center">
                <div className="font-display text-4xl mb-2">100%</div>
                <div className="text-accent-foreground/80 text-sm">Practical</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-medium tracking-widest mb-4">PROGRAMS</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Training Courses</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div key={course.title} className="bg-background p-6 border border-border">
                <course.icon size={40} className="text-accent mb-4" strokeWidth={1} />
                <h3 className="font-display text-xl text-foreground mb-2">{course.title}</h3>
                <p className="text-accent text-xs font-medium tracking-widest mb-3">{course.duration.toUpperCase()}</p>
                <p className="text-muted-foreground text-sm">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-accent text-sm font-medium tracking-widest mb-4">ELIGIBILITY</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Who Can Apply?</h2>
            <p className="text-muted-foreground mb-8">
              Our programs are open to young Somalis looking to develop practical skills. No prior experience required.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["Youth ages 16-35", "No experience needed", "Basic literacy required", "Commitment to complete"].map((item) => (
                <span key={item} className="px-4 py-2 border border-primary text-foreground text-sm">
                  {item}
                </span>
              ))}
            </div>
            <Link to="/contact" className="btn-gold inline-block">
              APPLY NOW
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img src={trainingWorkshop} alt="Contact CTA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl italic mb-4">Ready to Start Learning?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Contact us to learn more about our training programs.
          </p>
          <Link to="/contact" className="btn-gold inline-block">
            CONTACT US
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Training;
