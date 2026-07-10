import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';

const popularServices = ['Plumbing', 'Electrical', 'Cleaning', 'Tutoring', 'Photography', 'IT Support'];

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000",
    kicker: "Trusted by 40,000+ customers",
    title: "Find a professional you can actually rely on",
    subtitle: "Search by category and location, browse real profiles, and message providers directly — no calling around.",
    cta: "Search Professionals"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1676210134188-4c05dd172f89?auto=format&fit=crop&q=80&w=2000",
    kicker: "Licensed & verified plumbers",
    title: "Leaks and installs, handled properly",
    subtitle: "From dripping taps to full bathroom re-plumbs, find a verified plumber near you and message them directly.",
    cta: "Find a Plumber"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1779031242515-205111711b23?auto=format&fit=crop&q=80&w=2000",
    kicker: "Custom builds & renovations",
    title: "Craftsmanship that lasts decades",
    subtitle: "Browse verified carpenters for renovations, built-ins, and repairs — real profiles, real reviews.",
    cta: "Find a Carpenter"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-[640px] sm:min-h-[600px] lg:h-[760px] flex flex-col overflow-hidden pt-28 sm:pt-32 pb-16">
      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
        </div>
      ))}

      {/* Content — anchored left, not dead-centered, for a more editorial feel */}
      <div className="relative z-10 flex-1 flex items-end lg:items-center w-full">
        <div className="max-w-6xl mx-auto w-full px-5 sm:px-8">
          <div className="max-w-xl text-white">
            <div className="inline-flex items-center gap-1.5 text-[#ff9142] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4">
              <span className="h-px w-6 bg-[#ff9142]" />
              {current.kicker}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] mb-4 text-balance">
              {current.title}
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-7 max-w-md">
              {current.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => console.log('CTA clicked:', current.cta)}
                className="group inline-flex items-center justify-center gap-2 bg-[#f06d00] hover:bg-[#d96200] text-white font-semibold text-[15px] sm:text-base px-6 sm:px-7 py-3.5 rounded-lg transition-colors w-full sm:w-auto"
              >
                {current.cta}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              {/* Rating proof sits next to the CTA instead of a row of icon badges — reads as real product evidence, not decoration */}
              {/* <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="flex text-[#ffb02e]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="font-semibold">4.8</span>
                <span className="text-white/60">from 12,400 reviews</span>
              </div> */}
            </div>

            {/* Popular services — wraps naturally so it never overflows;
                collapses to a few chips + "+more" toggle on small screens */}
            <div className="flex flex-wrap gap-2 mt-8">
              {(showAllServices ? popularServices : popularServices.slice(0, 4)).map((service) => (
                <a
                  key={service}
                  href={`/search?service=${encodeURIComponent(service.toLowerCase())}`}
                  className="border border-white/30 hover:border-white/60 hover:bg-white/10 text-white/90 text-[13px] font-medium px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
                >
                  {service}
                </a>
              ))}
              {!showAllServices && popularServices.length > 4 && (
                <button
                  onClick={() => setShowAllServices(true)}
                  className="border border-white/30 hover:border-white/60 hover:bg-white/10 text-white/70 text-[13px] font-medium px-3.5 py-1.5 rounded-md transition-colors"
                >
                  +{popularServices.length - 4} more
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows — desktop only */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full transition-all z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-3 rounded-full transition-all z-20"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide indicators */}
      <div className="relative z-20 flex justify-center lg:justify-start lg:absolute lg:bottom-8 lg:left-8 gap-2.5 mt-8 lg:mt-0">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;