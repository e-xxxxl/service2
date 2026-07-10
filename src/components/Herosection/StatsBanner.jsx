import React from 'react';
import { ArrowRight } from 'lucide-react';

const stats = [
  { value: '40,000+', label: 'Customers served' },
  { value: '12,000+', label: 'Verified providers' },
  { value: '4.8 / 5', label: 'Average rating' },
  { value: '35+', label: 'Service categories' },
];

const StatsBanner = () => {
  return (
    <section className="bg-[#1c2029] py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 mb-16 sm:mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-[#f06d00] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 border-t border-white/10 pt-12 sm:pt-16">
          <div className="max-w-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
              Need something done? Find who can do it.
            </h2>
            <p className="text-white/60 leading-relaxed">
              Search a category, browse real profiles, and message a professional directly — no
              phone tag, no guesswork.
            </p>
          </div>
          <button
            onClick={() => console.log('Banner CTA clicked')}
            className="group inline-flex items-center justify-center gap-2 bg-[#f06d00] hover:bg-[#d96200] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors shrink-0 w-full lg:w-auto"
          >
            Search professionals
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;