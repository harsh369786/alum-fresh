"use client";
import React, { useState } from "react";
import type { Metadata } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Check, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(15, "Message must be at least 15 characters"),
});

type FormData = z.infer<typeof schema>;

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@alumfresh.in", href: "mailto:hello@alumfresh.in" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Location", value: "Jaipur, Rajasthan, India", href: "#" },
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
      toast({ title: "Message sent! 🌿", description: "We'll get back to you within 24 hours.", variant: "success" as any });
      reset();
    } catch {
      toast({ title: "Error", description: "Could not send message. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full mb-6">
            <span className="text-xs text-teal font-medium">Get in Touch</span>
          </div>
          <h1 className="font-syne font-black text-4xl sm:text-5xl text-text-primary mb-4">
            We&apos;d Love to <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="text-text-muted max-w-md mx-auto">
            Questions, feedback, wholesale enquiries, or just want to say hi — we&apos;re here.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <a href={href} key={label} className="glass-card rounded-2xl p-5 flex gap-4 items-center hover:-translate-y-1 transition-transform block">
                  <div className="w-10 h-10 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">{label}</p>
                    <p className="text-text-primary text-sm font-medium">{value}</p>
                  </div>
                </a>
              ))}

              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-syne font-bold text-sm text-text-primary mb-2">Working Hours</h3>
                <p className="text-text-muted text-sm">Mon – Sat: 10am – 6pm IST</p>
                <p className="text-text-muted text-sm">Sunday: Closed</p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="font-syne font-bold text-xl text-text-primary mb-6">Send us a message</h2>

                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-teal" />
                    </div>
                    <h3 className="font-syne font-bold text-xl text-text-primary mb-2">Message Sent! 🌿</h3>
                    <p className="text-text-muted">We&apos;ll get back to you within 24 hours.</p>
                    <Button variant="ghost" onClick={() => setSent(false)} className="mt-4">Send another message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input {...register("name")} placeholder="Priya Sharma" className="mt-1" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input {...register("email")} type="email" placeholder="priya@email.com" className="mt-1" />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input {...register("phone")} placeholder="+91 98765 43210" className="mt-1" />
                    </div>
                    <div>
                      <Label>Subject *</Label>
                      <Input {...register("subject")} placeholder="How can we help?" className="mt-1" />
                      {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <Label>Message *</Label>
                      <Textarea {...register("message")} placeholder="Tell us more..." className="mt-1" rows={4} />
                      {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" variant="teal" size="lg" className="w-full gap-2" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
