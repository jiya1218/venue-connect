"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users2, 
  LineChart, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Camera, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

const STATS = [
  { label: "Partner Vendors", val: "15,000+", icon: <Users2 className="text-primary" /> },
  { label: "Verified Leads Daily", val: "1,000+", icon: <Sparkles className="text-amber-500" /> },
  { label: "Major Cities Covered", val: "40+", icon: <MapPin className="text-sky-500" /> },
  { label: "Active Visitors", val: "1M+", icon: <LineChart className="text-emerald-500" /> }
];

const BENEFITS = [
  {
    title: "Qualified Leads",
    text: "Focus on closing, not chasing. Receive highly qualified inquiries tailored specifically to your event category and location.",
    icon: <Users2 size={32} className="text-primary" />
  },
  {
    title: "Online Marketing",
    text: "We handle your digital presence. Benefit from our massive SEO authority and targeted advertisements that put you in front of the right clients.",
    icon: <LineChart size={32} className="text-sky-500" />
  },
  {
    title: "Book More Clients",
    text: "Showcase your professional brand. Let verified clients discover your portfolio and request direct bookings through your VenueConnect profile.",
    icon: <CheckCircle2 size={32} className="text-emerald-500" />
  }
];

export default function BusinessRegisterPage() {
  const [formData, setFormData] = useState({
    serviceType: '',
    businessName: '',
    businessAddress: '',
    fullName: '',
    phone: '',
    email: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you for your interest! Our partner success team will contact you shortly.");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80" 
            className="w-full h-full object-cover opacity-30 grayscale" 
            alt="Business Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        <div className="max-w-[1800px] mx-auto px-10 md:px-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
                <ShieldCheck size={16} />
                <span className="text-xs font-black uppercase tracking-widest">Official Partner Portal</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Attract New <span className="text-primary">Customers</span> on VenueConnect
              </h1>
              <p className="text-xl text-slate-300 font-medium leading-relaxed">
                Get thousands of verified leads across the globe every day, grow your business, and expand your brand to new customers.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary backdrop-blur-md">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-white font-black text-sm uppercase tracking-tight">Verified Leads</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary backdrop-blur-md">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-white font-black text-sm uppercase tracking-tight">SEO Dominance</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="relative">
              <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-100 relative z-10">
                <h2 className="text-2xl font-black text-primary mb-2 tracking-tight uppercase">Boost your business!</h2>
                <p className="text-slate-500 font-bold mb-8 text-sm uppercase tracking-widest">Register in 60 seconds</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative group">
                      <select 
                        required
                        className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-no-repeat bg-[right_1.5rem_top_50%] transition-all"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      >
                        <option value="">Select Service Type</option>
                        <option value="venue">Venues</option>
                        <option value="photographer">Photographers</option>
                        <option value="decorator">Decorators</option>
                        <option value="caterer">Caterers</option>
                        <option value="makeup">Makeup Artists</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                    <input 
                      type="text" required placeholder="Business Name"
                      className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>

                  <input 
                    type="text" required placeholder="Business Address"
                    className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input 
                      type="text" required placeholder="Full Name"
                      className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                    <input 
                      type="tel" required placeholder="Phone Number"
                      className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input 
                      type="email" required placeholder="Work Email"
                      className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <div className="relative group">
                      <select 
                        required
                        className="w-full h-14 bg-slate-50 rounded-2xl border border-slate-100 px-6 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-no-repeat transition-all"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      >
                        <option value="">Primary City</option>
                        <option value="ahmedabad">Ahmedabad</option>
                        <option value="surat">Surat</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="delhi">Delhi</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                    </div>
                  </div>

                  <button className="w-full h-16 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:scale-[1.02] transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 mt-4">
                    Add Your Business <ArrowRight size={20} />
                  </button>

                  <p className="text-[10px] text-slate-400 font-bold text-center mt-6 leading-relaxed">
                    By clicking "Add Your Business", you agree to our Terms of Use and Privacy Policy.
                  </p>
                </form>
              </div>

              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-0" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl -z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-white py-14 border-b border-slate-100">
        <div className="max-w-[1800px] mx-auto px-10 md:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 group">
                <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-all duration-500">{s.icon}</div>
                <div>
                  <p className="text-3xl font-black text-slate-900 leading-tight">{s.val}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BENEFITS SECTION */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-10 md:px-20">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Three Pillars of Growth</h2>
            <p className="text-slate-500 font-bold text-lg leading-relaxed italic">"Our mission is to bridge the gap between world-class professionals and visionaries."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-white shadow-xl hover:shadow-3xl transition-all duration-500 group">
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mb-10 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
                  {b.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-tight">{b.title}</h3>
                <p className="text-slate-500 font-black text-sm leading-relaxed mb-6 opacity-70 uppercase tracking-tight">{b.text}</p>
                <div className="h-1 w-12 bg-primary group-hover:w-full transition-all duration-700 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SCALE SECTION (Content Rich) */}
      <section className="py-24 bg-white">
        <div className="max-w-[1800px] mx-auto px-10 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="rounded-[4rem] overflow-hidden shadow-3xl border-8 border-slate-50 aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80" className="w-full h-full object-cover" alt="Scale Business" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-3xl border border-slate-50 hidden md:block">
                <p className="text-4xl font-black text-primary">5x</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Growth</p>
              </div>
            </div>

            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight lowercase first-letter:uppercase">Scale your agency with VenueConnect</h2>
              
              <div className="space-y-8">
                {[
                  { title: "Global Traffic Dominance", detail: "Reach over 1 Million monthly active visitors looking for specialized event services.", icon: <LineChart className="text-primary" /> },
                  { title: "SEO Authority Engine", detail: "Automatic optimization for Google, Bing, and major search engines. We rank, you book.", icon: <Sparkles className="text-amber-500" /> },
                  { title: "Elite Digital Profiles", detail: "Detailed sections for high-res photos, descriptive text, contact info, and pricing packages.", icon: <Camera className="text-sky-400" /> }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="w-14 h-14 shrink-0 rounded-[1.25rem] bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">{item.icon}</div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-2xl"
                >
                  Start Listing Today <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA FOOTER */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-10 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight uppercase">Ready to grow your event business?</h2>
          <p className="text-xl text-white/80 font-bold mb-12 italic">Join the fastest growing network of event professionals in Gujarat and across India.</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-primary px-16 py-6 rounded-full font-black text-lg uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.3)] hover:scale-110 hover:shadow-white/40 transition-all"
          >
            Add Your Business Now
          </button>
        </div>
      </section>
    </main>
  );
}
