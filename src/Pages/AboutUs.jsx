// pages/AboutUs.jsx
import { Shield, Users, Star, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const AboutUs = () => {
  const stats = [
  { 
    value: "Verified", 
    label: "Every provider identity checked" 
  },
  { 
    value: "Secure", 
    label: "All communication on platform" 
  },
  { 
    value: "Local", 
    label: "Serving cities across Nigeria" 
  },
  { 
    value: "Free", 
    label: "No hidden charges for customers" 
  },
];

  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every service provider undergoes strict verification including NIN validation and document review before they can be visible to customers.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We're building a community where skilled Nigerian tradespeople can thrive and customers can find reliable help with confidence.",
    },
    {
      icon: Star,
      title: "Quality Service",
      description: "We verify providers, monitor reviews, and ensure only the best professionals represent our platform to customers across Nigeria.",
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description: "Our providers understand local building codes, materials, and techniques specific to Nigerian homes and businesses.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
        <Navbar/>
      {/* Hero Section */}
      <section className="relative bg-[#1E2420] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&q=80"
            alt="Nigerian tradespeople at work"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[12px] font-semibold uppercase tracking-wide text-white/80 mb-6 font-['IBM_Plex_Mono',monospace]">
              Our Story
            </span>
            <h1 className="text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-[1.1] mb-6 font-['Space_Grotesk',sans-serif]">
              Connecting Nigeria to trusted tradespeople
            </h1>
            <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed max-w-xl">
              We're on a mission to make it safe, easy, and reliable for Nigerians to find skilled professionals for any job, from plumbing to painting and everything in between.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-[#E2E0D9] p-6 text-center shadow-sm"
            >
              <p className="text-[28px] md:text-[32px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
                {stat.value}
              </p>
              <p className="text-[13px] text-[#55605A] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#1E7A34] font-['IBM_Plex_Mono',monospace]">
              Why we exist
            </span>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#1E2420] mt-3 mb-6 font-['Space_Grotesk',sans-serif] leading-tight">
              Finding reliable help shouldn't be a struggle
            </h2>
            <div className="space-y-4 text-[15px] text-[#55605A] leading-relaxed">
              <p>
                For too long, Nigerians have relied on word-of-mouth and unverified contacts to find tradespeople for essential home and business services. This often leads to inconsistent quality, safety concerns, and frustrating experiences.
              </p>
              <p>
                9jaTradiesPages was built to change that. We verify every service provider, monitor quality through customer reviews, and keep all communication secure on our platform to protect both parties.
              </p>
              <p>
                Whether you need an electrician in Lagos, a plumber in Abuja, or a painter in Port Harcourt, we connect you with pre-vetted professionals you can trust.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
              alt="Professional electrician working"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#1E7A34] font-['IBM_Plex_Mono',monospace]">
              Our values
            </span>
            <h2 className="text-[28px] md:text-[36px] font-bold text-[#1E2420] mt-3 font-['Space_Grotesk',sans-serif]">
              What we stand for
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-[#1E7A34]/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#1E7A34]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#1E2420] mb-2 font-['Space_Grotesk',sans-serif]">
                      {value.title}
                    </h3>
                    <p className="text-[14px] text-[#55605A] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#1E7A34] font-['IBM_Plex_Mono',monospace]">
            Simple process
          </span>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#1E2420] mt-3 font-['Space_Grotesk',sans-serif]">
            How it works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Search",
              description: "Browse verified professionals by service type and location. Filter by city and state to find someone near you.",
              image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&q=80",
            },
            {
              step: "02",
              title: "Connect",
              description: "Message providers directly through our secure platform. Discuss your needs and get quotes without sharing personal contact info.",
              image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80",
            },
            {
              step: "03",
              title: "Get it done",
              description: "Hire with confidence knowing every provider is verified. Leave a review to help others in the community.",
              image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
            },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-[32px] font-bold text-[#E2E0D9] font-['Space_Grotesk',sans-serif]">
                  {item.step}
                </span>
                <h3 className="text-[16px] font-semibold text-[#1E2420] mt-2 mb-2 font-['Space_Grotesk',sans-serif]">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#55605A] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-[#1E2420] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-[28px] md:text-[32px] font-bold text-white font-['Space_Grotesk',sans-serif] leading-tight mb-4">
                Every provider is verified before they can work
              </h2>
              <p className="text-[15px] text-white/60 leading-relaxed">
                We check NIN documents, verify identities with selfie photos, and review business details. Only approved providers appear in customer searches.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {["NIN document verification", "Selfie identity check", "Business details review", "Continuous quality monitoring"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#1E7A34] flex-shrink-0" />
                    <span className="text-[14px] text-white/80">{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28 text-center">
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#1E2420] mb-4 font-['Space_Grotesk',sans-serif]">
          Ready to find the right professional?
        </h2>
        <p className="text-[16px] text-[#55605A] mb-8 max-w-md mx-auto">
          Join thousands of Nigerians who trust 9jaTradiesPages for their home and business service needs.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-[#1E7A34] text-white rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] transition-colors inline-flex items-center gap-2"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-[#E2E0D9] text-[#1E2420] rounded-xl text-[14px] font-semibold hover:bg-[#F7F6F2] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default AboutUs;