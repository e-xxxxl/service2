// pages/ComingSoon.jsx
//
// Fonts used: Sora (display), Inter (body), IBM Plex Mono (labels).
// Add this to your index.html <head> if these aren't already loaded:
//
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
//
// Logo: a standalone vector lockup (9jaTradiesPages-logo.svg, 1600x711) is included
// alongside this file for use on socials, favicons, print, etc. The nav/footer below
// use a compact inline version of the same mark so it stays crisp at any size.

import { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Timer,
  BadgeCheck,
  Mail,
  MapPin,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import navlogo from '../../assets/navlogoo.png';

// Compact version of the brand mark — a house, a route, a wrench.
// Same idea as the full lockup, sized for the nav/footer.
const Mark = ({ className = 'h-8 w-8' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <path
      d="M4 40 L4 22 L20 8 L36 22 L36 40 Z"
      stroke="#0C6B3A"
      strokeWidth="4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <rect x="16" y="28" width="8" height="12" fill="#0C6B3A" />
    <path
      d="M40 34 C 46 34, 46 24, 52 24"
      stroke="#D9691D"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="0.5 8"
    />
    <path
      transform="translate(50,14) scale(0.7)"
      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      fill="#0C6B3A"
    />
  </svg>
);

const ComingSoon = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubscribed(true);
    setLoading(false);
  };

  const features = [
    { icon: BadgeCheck, title: 'Verified pros', desc: 'ID and trade-check before listing' },
    { icon: Timer, title: 'Fast matching', desc: 'A shortlist in minutes, not days' },
    { icon: ShieldCheck, title: 'Backed jobs', desc: 'Dispute support on every booking' },
    { icon: Wrench, title: 'Real trades', desc: 'Not generalists — actual specialists' },
  ];

  const serviceCategories = [
    {
      category: 'Home Improvement & Construction',
      items: [
        'Electricians', 'Plumbers', 'Carpenters', 'Painters', 'Tilers',
        'POP Ceiling Installers', 'Welders', 'Aluminium Fabricators',
        'Roofers', 'Building Contractors', 'Architects', 'Interior Designers',
      ],
    },
    {
      category: 'Installations & Repairs',
      items: [
        'Air Conditioner Installation & Repair', 'Generator Repair',
        'Borehole Drilling', 'Handyman Services', 'Appliance Repairs',
      ],
    },
    {
      category: 'Cleaning & Maintenance',
      items: [
        'Home Cleaning', 'Office Cleaning', 'Post-Construction Cleaning',
        'Laundry & Dry Cleaning', 'Fumigation', 'Pest Control',
      ],
    },
    {
      category: 'Automotive Services',
      items: [
        'Mechanics', 'Auto Electricians', 'Car Diagnostics', 'Panel Beaters',
        'Spray Painting', 'Vulcanizer', 'Car Detailing', 'Towing Services',
      ],
    },
    {
      category: 'Beauty & Personal Care',
      items: ['Hair Stylists', 'Barbers', 'Makeup Artists', 'Nail Technicians', 'Spa & Massage'],
    },
    {
      category: 'Events & Entertainment',
      items: [
        'Event Planners', 'Caterers', 'MCs', 'DJs', 'Photographers',
        'Videographers', 'Event Decorators', 'Event Rentals (Chairs, Canopies, Tables, etc.)',
      ],
    },
    {
      category: 'Business Services',
      items: [
        'Accountants', 'Lawyers', 'CAC Registration', 'Branding & Graphic Design',
        'Printing Services', 'Signage',
      ],
    },
  ];

  const stats = [
    { value: '500+', label: 'Providers signed on' },
    { value: '7', label: 'Service categories' },
    { value: '100%', label: 'ID-verified' },
    { value: '24/7', label: 'Support desk' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#15201B]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <header className="border-b border-[#DDE5E0]">
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
                      <Link to="/ ">
                            <div className="">
                              <img
                                src={navlogo}
                                alt="Logo"
                                className="h-18 w-auto object-contain"
                              />
                            </div>
                          </Link>
                    </div>
            <span
              className="text-[19px] tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
            >
              {/* <span className="text-[#0C6B3A]">9ja</span>
              <span className="font-medium">TradiesPages</span> */}
            </span>
          </div>
          {/* <nav className="hidden md:flex items-center gap-10 text-[14px] text-[#5C6B62]">
            <a href="#how" className="hover:text-[#15201B] transition-colors">How it works</a>
            <a href="#services" className="hover:text-[#15201B] transition-colors">Services</a>
            <a href="#contact" className="hover:text-[#15201B] transition-colors">Contact</a>
          </nav> */}
          {/* <a
            href="#notify"
            className="text-[13px] font-medium px-4 py-2.5 border border-[#15201B] hover:bg-[#15201B] hover:text-white transition-colors"
          >
            Get notified
          </a> */}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          {/* <div
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.14em] text-[#5C6B62] mb-6"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D9691D]" />
            LAUNCHING ACROSS NIGERIA
          </div> */}

          <h1
            className="text-[42px] md:text-[54px] leading-[1.08] mb-6"
            style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }}
          >
            The tradesperson
            <br />
            next door, <span className="text-[#0C6B3A]">verified</span>.
          </h1>

          <p className="text-[16px] md:text-[17px] text-[#5C6B62] max-w-md mb-10 leading-relaxed">
            9jaTradiesPages matches homeowners with ID-checked plumbers,
            electricians, and artisans nearby — no guesswork, no cold calls
            to strangers off a signboard.
          </p>

          {/* Status — static "Coming Soon" indicator, replaces the countdown */}
          <div
            className="inline-flex items-center gap-2.5 mb-10 py-2 pl-1 text-[13px] tracking-[0.14em] text-[#15201B]"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9691D] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9691D]" />
            </span>
            COMING SOON
          </div>

          {/* Email capture */}
          {/* <div id="notify" className="max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-3 border border-[#0C6B3A]/30 bg-[#E7F1EA] px-4 py-3.5">
                <Check className="h-5 w-5 text-[#0C6B3A] flex-shrink-0" />
                <p className="text-[14px] text-[#15201B]">
                  You're on the list — we'll email you at launch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C6B62]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#DDE5E0] border-r-0 text-[14px] placeholder:text-[#9AA5A0] focus:outline-none focus:border-[#0C6B3A]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-[#D9691D] hover:bg-[#BE5A17] text-white text-[14px] font-medium transition-colors flex items-center gap-2 disabled:opacity-60 whitespace-nowrap"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Notify me <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            )}
          </div> */}
        </div>

        {/* Signature graphic — the house-to-tradesperson route, the one bold element */}
        <div className="hidden md:block bg-[#E7F1EA] border border-[#0C6B3A]/15 p-10">
          <svg viewBox="0 0 420 300" className="w-full h-auto">
            <path
              d="M20 220 L20 130 L110 55 L200 130 L200 220 Z"
              fill="none" stroke="#0C6B3A" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
            />
            <rect x="90" y="160" width="40" height="60" fill="#0C6B3A" />
            <path
              d="M215 190 C 280 190, 280 100, 340 100"
              fill="none" stroke="#D9691D" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 14"
            />
            <circle cx="20" cy="220" r="5" fill="#0C6B3A" />
            <g transform="translate(330,80) scale(2.6)">
              <path
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                fill="#0C6B3A"
              />
            </g>
          </svg>
          <p
            className="text-[12px] tracking-[0.1em] text-[#5C6B62] mt-4"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            YOUR ADDRESS → THE RIGHT TRADESPERSON
          </p>
        </div>
      </section>

      {/* Features — spec-sheet row, not hover cards */}
     

      {/* Services — categorized, hairline-divided directory */}
      
      {/* Stats — thin bar, vertical hairlines */}
      

      {/* Footer */}
      
    </div>
  );
};

export default ComingSoon;