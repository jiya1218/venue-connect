"use client";

import Link from "next/link";
import { Building2, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ListBusinessChoice() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Grow Your Business with <span className="text-primary">VenueConnect</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join Gujarat's leading wedding and event platform. Choose your business category to get started.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Venue Option */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group hover:border-primary/50 transition-all duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">I own a Venue</h2>
              <p className="text-slate-600 mb-8">
                List your Banquet Hall, Hotel, Resort, or Farmhouse to get verified event leads.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Professional Photo Shoot
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Lead Dashboard
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Integrated Google Reviews
                </li>
              </ul>
              <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl">
                <Link href="/list-venue" className="flex items-center justify-center gap-2">
                  List My Venue <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Vendor Option */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group hover:border-pink-500/50 transition-all duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">I am a Vendor</h2>
              <p className="text-slate-600 mb-8">
                Photographers, Makeup Artists, Decorators and more. Showcase your portfolio to clients.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Portfolio Management
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Direct Customer Enquiries
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Social Media Promotion
                </li>
              </ul>
              <Button asChild className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl border-none">
                <Link href="/list-vendor" className="flex items-center justify-center gap-2">
                  Register as Vendor <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
