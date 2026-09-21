"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    if (!message.trim()) errs.message = "Please describe your inquiry.";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setIsSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#1F4E43]">
          Customer Care
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14171A]">
          Concierge &amp; Inquiries
        </h1>
        <p className="text-sm text-[#6B7280]">
          Whether you need bespoke dimension advice, material swatches, or order guidance, our San Francisco studio team is here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 bg-white rounded-xl border border-[#E4E7EB] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#14171A]">Direct Email</h3>
            <p className="text-xs text-[#6B7280]">concierge@demo.aura</p>
            <p className="text-[11px] text-[#9CA3AF]">Response window within 1 business day</p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E4E7EB] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#14171A]">Studio Telephone</h3>
            <p className="text-xs text-[#6B7280]">+1 (415) 555-0192</p>
            <p className="text-[11px] text-[#9CA3AF]">Monday – Friday, 9am – 5pm PT</p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E4E7EB] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#1F4E43]/10 flex items-center justify-center text-[#1F4E43]">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-[#14171A]">San Francisco Design Showroom</h3>
            <p className="text-xs text-[#6B7280]">742 Montgomery St, San Francisco, CA 94111</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4E7EB] p-6 sm:p-8 shadow-2xs">
          {isSent ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#18804E]/10 text-[#18804E] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#14171A]">
                Inquiry Received
              </h3>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Thank you for connecting with us. Our design concierge team will respond promptly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSent(false)}
                className="mt-4"
              >
                Send Another Note
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  placeholder="e.g. Marcus Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. marcus@demo.aura"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
              </div>

              <Input
                label="Subject (Optional)"
                placeholder="e.g. Material swatch inquiry, dimensions"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#14171A] mb-1.5"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our concierge assist with your space?"
                  className={`w-full p-3 rounded-md border text-base text-[#14171A] transition-colors focus-visible:outline-2 focus-visible:outline-[#1F4E43] ${
                    errors.message ? "border-[#C2222E]" : "border-[#E4E7EB]"
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-[#C2222E] mt-1">{errors.message}</p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Dispatch Inquiry
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
