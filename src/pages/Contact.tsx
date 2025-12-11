import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import servicesCollage from "@/assets/services-collage.png";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img src={servicesCollage} alt="Contact" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/85" />
        </div>
        <div className="container-custom relative z-10 text-primary-foreground pt-20">
          <p className="text-accent text-sm font-medium tracking-widest mb-4">CONTACT US</p>
          <h1 className="font-display text-4xl md:text-5xl italic">Get in Touch</h1>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                    className="border-border rounded-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                    className="border-border rounded-none"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="border-border rounded-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+252 XXX XXXXX"
                    className="border-border rounded-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={6}
                  required
                  className="border-border rounded-none resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full sm:w-auto disabled:opacity-50"
              >
                {isSubmitting ? "SENDING..." : "SUBMIT"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Boxes */}
      <section className="pb-16 bg-background">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary text-primary-foreground p-8 text-center">
              <Mail size={32} className="text-accent mx-auto mb-4" strokeWidth={1} />
              <h3 className="font-display text-lg mb-2">Email Us</h3>
              <a href="mailto:info@hiberindustries.com" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                info@hiberindustries.com
              </a>
            </div>
            <div className="bg-primary text-primary-foreground p-8 text-center">
              <Phone size={32} className="text-accent mx-auto mb-4" strokeWidth={1} />
              <h3 className="font-display text-lg mb-2">Call Us</h3>
              <a href="tel:+252XXXXXXX" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                +252 XXX XXXXX
              </a>
            </div>
            <div className="bg-primary text-primary-foreground p-8 text-center">
              <MapPin size={32} className="text-accent mx-auto mb-4" strokeWidth={1} />
              <h3 className="font-display text-lg mb-2">Our Location</h3>
              <p className="text-primary-foreground/80 text-sm">Mogadishu, Somalia</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
