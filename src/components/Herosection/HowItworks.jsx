import React from 'react';
import { Search, UserSearch, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search your service',
    description: 'Choose a category, then narrow by state and city to see who\u2019s available near you.'
  },
  {
    number: '02',
    icon: UserSearch,
    title: 'Browse profiles',
    description: 'Compare provider profiles, service details, and past work to find the right fit.'
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Message directly',
    description: 'Discuss requirements, pricing, and availability in-app before you commit to anything.'
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-14 sm:mb-20">
          <span className="text-[#f06d00] text-xs sm:text-sm font-semibold tracking-wide uppercase">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2d333f] mt-3 leading-tight">
            Find and message a professional in three steps
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-x-8 gap-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative pt-6 border-t-2 border-[#2d333f]">
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(100%+1rem)] w-8 border-t border-gray-200" />
                )}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-gray-400">{step.number}</span>
                  <Icon size={20} className="text-[#f06d00]" />
                </div>
                <h3 className="text-lg font-bold text-[#2d333f] mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;