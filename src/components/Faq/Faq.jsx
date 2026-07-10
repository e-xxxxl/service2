import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'Is it free to search and message providers?',
    answer: 'Yes. Creating an account, searching for professionals, and messaging them is free. Any cost is agreed directly between you and the provider for the service itself.'
  },
  {
    question: 'How do I find someone in my area?',
    answer: 'Search by service category, then filter by state and city. You\u2019ll see a list of providers available in that area along with their profiles.'
  },
  {
    question: 'How are providers verified?',
    answer: 'Every provider is checked before their profile goes live \u2014 identity, and relevant credentials or licensing where applicable. Reviews come only from customers who\u2019ve messaged and worked with them through the platform.'
  },
  {
    question: 'How do I discuss pricing or availability?',
    answer: 'Once you find a provider you like, start a conversation through the built-in messaging system. That\u2019s where you\u2019ll work out pricing, timing, and any other details directly.'
  },
  {
    question: 'Can I message more than one provider?',
    answer: 'Yes. There\u2019s no limit \u2014 message as many providers as you\u2019d like to compare before deciding who to go with.'
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[#2d333f] text-[15px] sm:text-base">
          {faq.question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'rotate-45 bg-[#2d333f] border-[#2d333f]' : ''
          }`}
        >
          <Plus size={16} className={isOpen ? 'text-white' : 'text-[#2d333f]'} />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-gray-500 leading-relaxed pb-6 pr-10">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="mb-10 sm:mb-14">
          <span className="text-[#f06d00] text-xs sm:text-sm font-semibold tracking-wide uppercase">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2d333f] mt-3 leading-tight">
            Questions people ask before signing up
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;