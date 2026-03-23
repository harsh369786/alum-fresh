"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/manage";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream/30 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-sage-light/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-parchment rounded-full blur-3xl translate-x-1/2 translate-y-1/4 pointer-events-none opacity-40" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-black text-warm hover:text-charcoal transition-colors group z-20">
        <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
        Return to Store
      </Link>
      
      <div className="bg-white/80 backdrop-blur-md border border-parchment rounded-[2.5rem] p-10 md:p-12 w-full max-w-[440px] shadow-2xl animate-fade-up relative overflow-hidden z-10">
        <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] rotate-12">
           <Lock className="w-48 h-48 text-charcoal" />
        </div>
        
        <div className="relative z-10 text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center font-serif italic text-xl mx-auto mb-6 shadow-md shadow-charcoal/20">
            AF
          </div>
          <span className="eyebrow block mb-2">Restricted Access</span>
          <h1 className="font-serif italic text-3xl text-charcoal leading-tight">Admin Console</h1>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-6">
          {error && (
             <div className="p-4 bg-rose-light/20 border border-rose-light text-rose text-[0.85rem] rounded-2xl text-center font-medium animate-fade-up">
               {error}
             </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Username</label>
            <Input 
              value={username} onChange={e => setUsername(e.target.value)} 
              placeholder="Admin ID" className="rounded-full bg-white/70 border-parchment px-6 h-14 text-[0.95rem] focus-visible:ring-sage-dark shadow-inner" required 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Passphrase</label>
            <Input 
              type="password"
              value={password} onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" className="rounded-full bg-white/70 border-parchment px-6 h-14 text-[0.95rem] focus-visible:ring-sage-dark shadow-inner tracking-[0.2em]" required 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 rounded-full text-[0.9rem] shadow-xl mt-4 bg-charcoal hover:bg-sage-dark text-white transition-all duration-500 hover:shadow-sage-dark/30">
             {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Authenticate 🔓"}
          </Button>
        </form>
      </div>
    </div>
  );
}
