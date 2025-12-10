import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { GraduationCap, Wrench, Cog, Hammer, ArrowRight, CheckCircle, Users, Award, Clock } from "lucide-react";

const courses = [
  {
    icon: Wrench,
    title: "Welding & Metal Joining",
    duration: "3-6 months",
    description: "Master various welding techniques including MIG, TIG, and arc welding for industrial applications.",
  },
  {
    icon: Cog,
    title: "Machining & Metalwork",
    duration: "4-6 months",
    description: "Learn precision machining, lathe operations, and CNC basics for manufacturing.",
  },
  {
    icon: Hammer,
    title: "Steel Fabrication",
    duration: "3-6 months",
    description: "Comprehensive training in structural steel work, cutting, and assembly techniques.",
  },
  {
    icon: GraduationCap,
    title: "Industrial Safety",
    duration: "1-2 months",
    description: "Essential safety protocols, PPE usage, and emergency procedures for industrial environments.",
  },
];

const benefits = [
  "Hands-on training in real workshop environment",
  "Experienced engineers and technicians as instructors",
  "Industry-recognized certification upon completion",
  "Job placement assistance and referrals",
  "Modern equipment and tools",
  "Small class sizes for personalized attention",
];

const stats = [
  { icon: Users, value: "200+", label: "Graduates" },
  { icon: Award, value: "85%", label: "Employment Rate" },
  { icon: Clock, value: "6", label: "Training Programs" },
];

const Training = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-fade-in">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-medium">TVET Training Programs</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl text-secondary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              BUILD YOUR <span className="text-primary">SKILLS</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/70 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Empowering Somalia's workforce through hands-on technical and vocational training in industrial skills.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background relative -mt-8 z-20">
        <div className="container-custom">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card p-6 rounded-lg shadow-card text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-display text-3xl text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Training */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                INVESTING IN <span className="text-primary">PEOPLE</span>
              </h2>
              <div className="space-y-4 text-muted-foreground mb-8">
                <p>
                  At HIBER Industries, we believe that Somalia's industrial future depends on a skilled and capable workforce. Our TVET (Technical and Vocational Education and Training) programs are designed to bridge the skills gap and create employment opportunities for young Somalis.
                </p>
                <p>
                  Our training center operates within our industrial facility, providing students with real-world experience using actual production equipment under the guidance of experienced engineers and technicians.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in-right">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80"
                alt="Training workshop"
                className="rounded-lg shadow-elevated"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-lg shadow-glow">
                <div className="font-display text-3xl text-primary-foreground">Job-Ready</div>
                <div className="text-primary-foreground/80 text-sm">Skills Training</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              TRAINING <span className="text-primary">PROGRAMS</span>
            </h2>
            <p className="text-muted-foreground">
              Choose from our range of industry-focused training courses designed to equip you with practical skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={course.title}
                className="bg-card p-8 rounded-lg shadow-card card-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <course.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-xl text-foreground">{course.title}</h3>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded text-primary text-xs font-medium mb-3">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <p className="text-muted-foreground text-sm">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-secondary-foreground mb-6">
                WHO CAN <span className="text-primary">APPLY?</span>
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Youth & Young Adults", desc: "Ages 18-35 seeking technical career opportunities" },
                  { title: "Career Changers", desc: "Professionals looking to enter the industrial sector" },
                  { title: "Existing Workers", desc: "Factory employees wanting to upgrade their skills" },
                  { title: "Entrepreneurs", desc: "Business owners seeking manufacturing knowledge" },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-1 bg-primary rounded-full" />
                    <div>
                      <h4 className="font-semibold text-secondary-foreground mb-1">{item.title}</h4>
                      <p className="text-secondary-foreground/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy-light p-8 rounded-lg animate-fade-in">
              <h3 className="font-display text-2xl text-secondary-foreground mb-4">Ready to Start?</h3>
              <p className="text-secondary-foreground/70 mb-6">
                Contact us to learn more about enrollment, schedules, and program fees. We also offer scholarships for qualified candidates.
              </p>
              <Button asChild className="w-full bg-primary hover:bg-copper-dark">
                <Link to="/contact">
                  Inquire About Training
                  <ArrowRight className="ml-2" size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Training;
