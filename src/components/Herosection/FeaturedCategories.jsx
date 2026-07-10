import React from 'react';
import { Wrench, Zap, Sparkles, GraduationCap, Camera, PartyPopper, Laptop, Dumbbell, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Plumbing', count: '3,200+ providers', icon: Wrench },
  { name: 'Electrical', count: '2,800+ providers', icon: Zap },
  { name: 'Home Cleaning', count: '4,100+ providers', icon: Sparkles },
  { name: 'Tutoring', count: '1,500+ providers', icon: GraduationCap },
  { name: 'Photography', count: '980+ providers', icon: Camera },
  { name: 'Event Planning', count: '760+ providers', icon: PartyPopper },
  { name: 'IT Support', count: '1,100+ providers', icon: Laptop },
  { name: 'Personal Training', count: '890+ providers', icon: Dumbbell },
];

const FeaturedCategories = () => {
  return (
    <section className="bg-[#fafafa] py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="text-[#f06d00] text-xs sm:text-sm font-semibold tracking-wide uppercase">
              Browse by category
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d333f] mt-3 leading-tight">
              Search professionals by category and location
            </h2>
          </div>
          <a
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 text-[#2d333f] font-semibold text-sm hover:text-[#f06d00] transition-colors shrink-0"
          >
            View all categories
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <a
                key={category.name}
                href={`/search?category=${encodeURIComponent(category.name.toLowerCase())}`}
                className="group bg-white border border-gray-200 hover:border-[#2d333f] rounded-lg p-5 sm:p-6 transition-colors"
              >
                <Icon size={22} className="text-[#2d333f] mb-4" strokeWidth={1.75} />
                <h3 className="font-semibold text-[#2d333f] mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </a>
            );
          })}
        </div>

        <a
          href="/search"
          className="sm:hidden mt-8 inline-flex items-center gap-1.5 text-[#2d333f] font-semibold text-sm hover:text-[#f06d00] transition-colors"
        >
          View all categories
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
};

export default FeaturedCategories;