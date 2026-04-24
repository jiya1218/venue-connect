"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <PageHeader
                title="Contact Us"
                subtitle="We're here to help you plan your perfect event."
            />

            <main className="flex-grow container py-16 max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Contact Details */}
                    <div>
                        <h2 className="text-3xl font-display font-semibold mb-6">Get in Touch</h2>
                        <p className="text-muted-foreground mb-10">
                            Have a question about a venue, need help with your booking, or want to list your space on our platform? Our team is ready to assist you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-lg font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    Call Us
                                </div>
                                <p className="text-muted-foreground pl-13">+91 9601015102</p>
                                <p className="text-muted-foreground text-sm pl-13">Mon - Sat, 9am - 7pm</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-lg font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    Email Us
                                </div>
                                <p className="text-muted-foreground pl-13">info@venueconnect.in</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-lg font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    Headquarters
                                </div>
                                <p className="text-muted-foreground pl-13">
                                    101, Titanium City Center,<br />
                                    100 Feet Anand Nagar Rd, Prahlad Nagar,<br />
                                    Ahmedabad, Gujarat 380015
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-2xl font-display font-medium mb-6">Send a Message</h3>
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="How can we help?" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Include as much detail as possible..." rows={5} className="resize-none" />
                            </div>

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" size="lg">
                                Send Message
                            </Button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}
