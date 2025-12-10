import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({ title: "Message Sent!", description: "We'll get back to you as soon as possible." });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <section className="pt-32 pb-16 bg-muted">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"><span className="text-sm font-medium text-primary">Contact Us</span></div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">Get in <span className="text-primary">Touch</span></h1>
            <p className="text-lg text-muted-foreground">Have a project in mind or want to learn about our training? We'd love to hear from you.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8">Reach out to us through any of these channels.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><MapPin className="text-primary" size={20} /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Location</h3><p className="text-muted-foreground text-sm">Mogadishu, Somalia</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Phone className="text-primary" size={20} /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Phone</h3><a href="tel:+252XXXXXXX" className="text-muted-foreground text-sm hover:text-primary transition-colors">+252 XXX XXXXX</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Mail className="text-primary" size={20} /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Email</h3><a href="mailto:info@hiberindustries.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">info@hiberindustries.com</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><Clock className="text-primary" size={20} /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Working Hours</h3><p className="text-muted-foreground text-sm">Saturday - Thursday<br />8:00 AM - 5:00 PM</p></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Your Name</label><Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required className="rounded-xl" /></div>
                    <div><label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email Address</label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required className="rounded-xl" /></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone Number</label><Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+252 XXX XXXXX" className="rounded-xl" /></div>
                    <div><label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label><Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" required className="rounded-xl" /></div>
                  </div>
                  <div><label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your project..." rows={5} required className="rounded-xl resize-none" /></div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto rounded-full px-10" disabled={isSubmitting}>{isSubmitting ? "Sending..." : (<>Send Message<Send className="ml-2" size={18} /></>)}</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;