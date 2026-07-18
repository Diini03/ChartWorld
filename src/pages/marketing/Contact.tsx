import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [sending, setSending] = useState(false);
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">Contact</p>
        <h1 className="font-display text-5xl">Get in touch.</h1>
        <p className="mt-4 text-muted-foreground">Questions, feedback, or partnership ideas — we read everything.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              toast.success("Thanks — we'll be in touch shortly.");
              (e.target as HTMLFormElement).reset();
            }, 500);
          }}
          className="mt-10 space-y-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" required /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="msg">Message</Label><Textarea id="msg" rows={5} required /></div>
          <Button type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
        </form>
      </div>
    </section>
  );
}
