import React from 'react';
import { ShieldCheck, Users2, MessageCircle } from 'lucide-react';

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified providers',
    description: 'Every provider is checked before their profile is listed, so you know who you\u2019re reaching out to.'
  },
  {
    icon: Users2,
    title: 'Real profiles',
    description: 'See service details, experience, and reviews from real customers before you make contact.'
  },
  {
    icon: MessageCircle,
    title: 'Direct messaging',
    description: 'Talk to providers yourself, on your own terms \u2014 no call centre, no middleman.'
  },
];

const AboutUs = () => {
  return (
    <section className="bg-white py-20 sm:py-28 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <span className="text-[#f06d00] text-xs sm:text-sm font-semibold tracking-wide uppercase">
              About us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d333f] mt-3 mb-6 leading-tight">
              A simpler way to find and reach the right professional
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Finding the right person for a job usually means searching around, calling a few
              numbers, and hoping someone calls back. We built this platform to make that part
              simple.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Search by category and location, look through real provider profiles, and message
              the ones that fit \u2014 all from one place, without leaving the platform.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="flex gap-4 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                  <Icon size={22} className="text-[#2d333f] shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div>
                    <h3 className="font-bold text-[#2d333f] mb-1.5">{value.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;