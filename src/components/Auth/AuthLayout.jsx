// components/auth/AuthLayout.jsx
import React, { useEffect, useState } from 'react';

const DEFAULT_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1581578731548-5f7d6c0a3c5e?auto=format&fit=crop&q=80&w=2070",
    caption: "Licensed professionals ready when you need them",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85ee64?auto=format&fit=crop&q=80&w=2070",
    caption: "Get multiple quotes and choose with confidence",
  },
  {
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=2070",
    caption: "Direct messaging with trusted local pros",
  },
];

const Carousel = ({ slides = DEFAULT_SLIDES, interval = 5000 }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#f8f7f4]">
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}

      {/* Subtle dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Caption */}
      <div className="absolute bottom-12 left-10 right-10">
        <p className="text-white text-[15px] font-medium leading-snug max-w-md">
          {slides[active].caption}
        </p>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === active ? 'bg-white w-8' : 'bg-white/40 w-5'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AuthLayout = ({ slides, children }) => (
  <div className="min-h-screen flex bg-white">
    {/* Left: Full-bleed image side */}
    <div className="hidden lg:block lg:w-1/2 relative">
      <div className="absolute inset-0">
        <Carousel slides={slides} />
      </div>
    </div>

    {/* Right: Form side */}
    <div className="flex-1 flex items-start justify-center pt-20 lg:pt-16 pb-12 px-6">
      <div className="w-full max-w-[380px]">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;