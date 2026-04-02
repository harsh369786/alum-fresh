"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Check, Loader2, ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(15, "Message must be at least 15 characters"),
});

type FormData = z.infer<typeof schema>;

const CONTACT_INFO = [
  { icon: Mail, label: "Send an Email", value: "sales.theauracompany@gmail.com", href: "mailto:sales.theauracompany@gmail.com" },
  { icon: Phone, label: "Call Darshil Gada", value: "+91 99876 40584", href: "tel:+919987640584" },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSent(true);
      toast({ title: "Message sent! 🌿", description: "We'll get back to you within 24 hours." });
      reset();
    } catch {
      toast({ title: "Error", description: "Could not send message. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-cream/30">
      {/* Header */}
      <section className="pt-12 pb-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-sage-light/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-up">
          <span className="eyebrow">Contact Us</span>
          <h1 className="font-serif italic text-[clamp(2.5rem,6vw,4rem)] text-charcoal leading-tight mb-8">
            We&apos;d love to <em className="text-sage-dark">hear from you.</em>
          </h1>
          <p className="text-[1.1rem] text-warm max-w-xl mx-auto leading-relaxed font-light">
            Questions, feedback, or retail enquiries — our team is here to help you navigate your natural journey.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
            
            {/* Info Cards */}
            <div className="lg:col-span-2 space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="mb-10">
                 <h2 className="font-serif text-[1.8rem] text-charcoal mb-4">Studio Information</h2>
                 <p className="text-[0.85rem] text-warm leading-relaxed opacity-80">Our Jaipur studio is where tradition meets formulation. Feel free to reach out during our working hours.</p>
              </div>

              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <a 
                  href={href} 
                  key={label} 
                  className="bg-white border border-parchment rounded-[1.5rem] p-6 flex gap-5 items-center hover:shadow-lg hover:border-sage-light transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0 text-sage-dark group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-warm mb-0.5 opacity-60">{label}</p>
                    <p className="text-[0.95rem] text-charcoal font-medium">{value}</p>
                  </div>
                  <ArrowRight className="ml-auto w-4 h-4 text-parchment group-hover:text-sage-dark group-hover:translate-x-2 transition-all" />
                </a>
              ))}

              <div className="bg-charcoal text-white rounded-[1.5rem] p-8 mt-10 shadow-xl relative overflow-hidden prose-invert">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                   <Mail className="w-32 h-32" />
                </div>
                <h3 className="font-serif italic text-xl mb-4 relative z-10">Studio Hours</h3>
                <div className="space-y-2 text-[0.8rem] font-light opacity-80 relative z-10">
                  <p className="flex justify-between"><span>Mon – Saturday</span> <span>10 am – 06 pm IST</span></p>
                  <p className="flex justify-between"><span>Sundays</span> <span>Resting</span></p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white border border-parchment rounded-[2.5rem] p-8 md:p-12 shadow-[0_12px_45px_rgba(44,44,44,0.03)] border-t-4 border-t-sage-dark">
                <h2 className="font-serif text-[2.2rem] text-charcoal mb-8">Send a Message</h2>

                {sent ? (
                  <div className="text-center py-20 animate-fade-up">
                    <div className="w-24 h-24 rounded-full bg-sage-light/20 border border-sage-light/40 flex items-center justify-center mx-auto mb-8 relative">
                      <Check className="w-10 h-10 text-sage-dark" />
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20 border-2 border-sage-dark" />
                    </div>
                    <h3 className="font-serif italic text-3xl text-charcoal mb-4">Message delivered.</h3>
                    <p className="text-warm mb-10 max-w-xs mx-auto text-[0.9rem] leading-relaxed">We&apos;ve received your thoughts and will respond within nature&apos;s cycle (usually 24 hours).</p>
                    <Button variant="outline" onClick={() => setSent(false)} className="px-10">New Enquiry</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label className="text-[0.68rem] uppercase tracking-widest text-warm ml-4">Your Name</Label>
                        <Input {...register("name")} placeholder="Ayesha Kapoor" className="rounded-full bg-cream/20 border-parchment px-6 h-12 text-[0.85rem] focus-visible:ring-charcoal shadow-sm transition-all" />
                        {errors.name && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[0.68rem] uppercase tracking-widest text-warm ml-4">Email Address</Label>
                        <Input {...register("email")} type="email" placeholder="ayesha@email.com" className="rounded-full bg-cream/20 border-parchment px-6 h-12 text-[0.85rem] focus-visible:ring-charcoal shadow-sm transition-all" />
                        {errors.email && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label className="text-[0.68rem] uppercase tracking-widest text-warm ml-4">Phone (Optional)</Label>
                        <Input {...register("phone")} placeholder="+91 98765 00000" className="rounded-full bg-cream/20 border-parchment px-6 h-12 text-[0.85rem] focus-visible:ring-charcoal shadow-sm transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[0.68rem] uppercase tracking-widest text-warm ml-4">Subject</Label>
                        <Input {...register("subject")} placeholder="Wholesale / Feedback / Support" className="rounded-full bg-cream/20 border-parchment px-6 h-12 text-[0.85rem] focus-visible:ring-charcoal shadow-sm transition-all" />
                        {errors.subject && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.subject.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[0.68rem] uppercase tracking-widest text-warm ml-4">Your Thoughts</Label>
                      <Textarea {...register("message")} placeholder="Tell us more about your discovery..." className="rounded-[1.5rem] bg-cream/20 border-parchment px-6 py-5 text-[0.85rem] focus-visible:ring-charcoal shadow-sm resize-none transition-all" rows={5} />
                      {errors.message && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.message.message}</p>}
                    </div>

                    <div className="pt-4">
                      <Button type="submit" size="lg" className="w-full py-8 text-[1rem] shadow-xl group" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />}
                        Deliver Message &nbsp;→
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
