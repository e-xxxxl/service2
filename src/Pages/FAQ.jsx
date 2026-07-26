// pages/FAQ.jsx
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSections = [
    {
      category: "General",
      icon: HelpCircle,
      questions: [
        {
          question: "What is 9jaTradiesPages?",
          answer: "9jaTradiesPages is a platform that connects Nigerian homeowners and businesses with verified, skilled tradespeople. We verify every service provider's identity before they can be visible to customers, ensuring safer and more reliable connections.",
        },
        {
          question: "Is 9jaTradiesPages free to use?",
          answer: "Yes, the platform is free for customers to search for professionals, browse profiles, and message providers. Service providers can also create profiles and connect with customers at no cost.",
        },
        {
          question: "Which cities do you operate in?",
          answer: "We currently serve all major cities across Nigeria including Lagos, Abuja, Port Harcourt, Ibadan, Kano, Enugu, Benin City, and many more. Providers can specify their service areas during profile setup.",
        },
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button, choose whether you need a service or provide a service, enter your name, email, and password. Verify your email address and you're ready to go. Service providers will need to complete additional verification steps.",
        },
      ],
    },
    {
      category: "For Customers",
      icon: HelpCircle,
      questions: [
        {
          question: "How do I find a professional?",
          answer: "After logging in, use the search bar on your dashboard to filter by service type, state, and city. You'll see a list of verified providers in your area. Click on any profile to view details, ratings, and send them a message.",
        },
        {
          question: "Are all providers verified?",
          answer: "Yes. Every provider visible in search results has been verified by our team. This includes NIN document verification, selfie identity check, and business details review. Unverified providers are not visible to customers.",
        },
        {
          question: "Can I share my phone number with a provider?",
          answer: "No. To protect both parties, our messaging system automatically blocks phone numbers, email addresses, and other contact information. All communication should stay on the platform for safety.",
        },
        {
          question: "What if I'm not satisfied with a service?",
          answer: "We encourage you to communicate your concerns directly with the provider through our platform. You can also leave an honest review to help other customers make informed decisions. For serious issues, contact our support team.",
        },
        {
          question: "How do I save a provider for later?",
          answer: "Click the heart icon on any provider's profile card to save them to your favorites. You can access your saved providers from the 'Saved' tab on your dashboard.",
        },
      ],
    },
    {
      category: "For Service Providers",
      icon: HelpCircle,
      questions: [
        {
          question: "How do I become a service provider?",
          answer: "Sign up and select 'I provide a service'. After verifying your email, complete your profile by selecting your service category, adding a tagline, uploading your NIN document and a clear selfie, and providing your business address. Submit for verification and our team will review your documents within 24-48 hours.",
        },
        {
          question: "What documents do I need for verification?",
          answer: "You need to provide your NIN (National Identification Number), a clear photo or scan of your NIN document or slip, and a recent selfie showing your face clearly. Your address, service type, and tagline are also required.",
        },
        {
          question: "How long does verification take?",
          answer: "Our team typically reviews profiles within 24-48 hours. You'll receive a notification and email once your profile is approved or if any changes are needed.",
        },
        {
          question: "What if my verification is rejected?",
          answer: "You'll receive a notification with the specific reason for rejection. You can update your documents and resubmit for review. Common reasons include unclear NIN documents, poor quality selfies, or incomplete profile information.",
        },
        {
          question: "Can I offer multiple services?",
          answer: "Currently, each provider profile is associated with one primary service category. Choose the service that best represents your main trade. You can mention additional skills in your business description.",
        },
        {
          question: "How do I manage my availability?",
          answer: "Use the availability toggle on your dashboard to indicate whether you're currently available for jobs. When set to unavailable, you won't appear in customer searches.",
        },
      ],
    },
    {
      category: "Safety & Privacy",
      icon: HelpCircle,
      questions: [
        {
          question: "How is my personal information protected?",
          answer: "Your verification documents (NIN and selfie) are stored securely on Cloudinary with encrypted access. Only authorized administrators can view these documents for verification purposes. They are never shared with other users.",
        },
        {
          question: "Why can't I share contact information in messages?",
          answer: "Keeping communication on our platform protects both parties from fraud, harassment, and unsafe situations. It also ensures there's a record of all communication in case of disputes.",
        },
        {
          question: "What happens to my data if I delete my account?",
          answer: "You can request account deletion at any time. We will remove your personal information from our active systems. Some information may be retained for legal compliance purposes as outlined in our Privacy Policy.",
        },
        {
          question: "How do you verify provider identities?",
          answer: "We cross-reference the NIN number provided with the uploaded NIN document, and match the selfie photo to ensure the person registering is the legitimate owner of the documents. Our team manually reviews each submission.",
        },
      ],
    },
    {
      category: "Account & Support",
      icon: HelpCircle,
      questions: [
        {
          question: "I forgot my password. What do I do?",
          answer: "Currently, password reset is available by contacting our support team. We're working on adding a self-service password reset feature soon.",
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team by emailing support@9jatradiespages.com. We typically respond within a few hours during business days.",
        },
        {
          question: "Can I have both a customer and provider account?",
          answer: "Each email address can only be associated with one account type. If you need both, please use separate email addresses for each account type.",
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team at support@9jatradiespages.com with your account email address and request account deletion. We'll process your request within 48 hours.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
        <Navbar/>
      {/* Header */}
      <section className="bg-white border-b border-[#E2E0D9] pt-10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#1E7A34] font-['IBM_Plex_Mono',monospace]">
            Help centre
          </span>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1E2420] mt-3 mb-4 font-['Space_Grotesk',sans-serif] leading-tight">
            Frequently asked questions
          </h1>
          <p className="text-[15px] text-[#55605A] leading-relaxed max-w-xl">
            Find answers to common questions about using 9jaTradiesPages. If you can't find what you're looking for, contact our support team.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-12 md:py-16">
        <div className="space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <div key={section.category}>
              <h2 className="text-[18px] font-semibold text-[#1E2420] mb-4 font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                <section.icon className="h-5 w-5 text-[#1E7A34]" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.questions.map((item, questionIndex) => {
                  const globalIndex = `${sectionIndex}-${questionIndex}`;
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div
                      key={globalIndex}
                      className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(globalIndex)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F7F6F2] transition-colors"
                      >
                        <span className="text-[14px] font-medium text-[#1E2420] pr-4">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-[#9A9488] flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4">
                          <div className="border-t border-[#E2E0D9] pt-4">
                            <p className="text-[14px] text-[#55605A] leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-16 md:pb-20">
        <div className="bg-white rounded-xl border border-[#E2E0D9] p-6 md:p-8 text-center">
          <h3 className="text-[16px] font-semibold text-[#1E2420] mb-2 font-['Space_Grotesk',sans-serif]">
            Still have questions?
          </h3>
          <p className="text-[14px] text-[#55605A] mb-4">
            Our support team is ready to help. We typically respond within a few hours.
          </p>
          <a
            href="mailto:support@9jatradiespages.com"
            className="inline-block px-5 py-2.5 bg-[#1E7A34] text-white rounded-lg text-[14px] font-semibold hover:bg-[#166B2C] transition-colors"
          >
            Contact support
          </a>
        </div>
      </section>
      <Footer   />
    </div>
  );
};

export default FAQ;