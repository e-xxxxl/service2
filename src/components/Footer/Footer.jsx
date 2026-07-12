import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import  navlogo  from '../../assets/navlogoo.png';
import { Link } from 'react-router-dom';
// lucide-react no longer ships brand/logo icons (Facebook, Instagram, LinkedIn, etc.)
// since those are trademarked logos, not generic icons — so these are small inline
// SVGs instead of a package import that may not exist in your installed version.
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-6.5-5.94-8.68-2.91V8.48Z" />
  </svg>
);

const linkColumns = [
  {
    heading: 'For customers',
    links: ['Search professionals', 'How it works', 'Reviews', 'Help centre'],
  },
  {
    heading: 'For providers',
    links: ['Create a profile', 'How messaging works', 'Pricing', 'Provider resources'],
  },
  {
    heading: 'Company',
    links: ['About us', 'Careers', 'Press', 'Contact us'],
  },
  {
    heading: 'Legal',
    links: ['Terms of service', 'Privacy policy', 'Trust & safety'],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#1c2029] text-white/70">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Get updates & tips</h3>
            <p className="text-sm text-white/50">One email a month. No spam, unsubscribe anytime.</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); console.log('Newsletter signup'); }}
            className="flex w-full lg:w-auto max-w-sm gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#f06d00] transition-colors min-w-0"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="shrink-0 bg-[#f06d00] hover:bg-[#d96200] text-white p-2.5 rounded-lg transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
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
            <p className="text-sm text-white/50 leading-relaxed mb-5 max-w-[220px]">
              Search, browse profiles, and message verified service providers directly.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <LinkedinIcon />
              </a>
              <a href="mailto:hello@hipages.example" aria-label="Email" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {linkColumns.map((column) => (
            <div key={column.heading}>
              <h4 className="text-white font-semibold text-sm mb-4">{column.heading}</h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} hipages. All rights reserved.</span>
          <span>Made for Nigerian customers and service providers.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;