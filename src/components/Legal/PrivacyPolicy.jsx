// components/legal/PrivacyPolicy.jsx
import { Shield, Lock, Eye, Mail, FileText } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#F5F4F0]">
        <Navbar/>
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-[#1E7A34]" />
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
              Last updated: July 2026
            </span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[15px] text-[#55605A] mt-4 leading-relaxed">
            At 9jaTradiesPages, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information when you use our platform.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          <Section
            icon={FileText}
            title="Information We Collect"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  We collect information you provide directly to us when you create an account, complete your profile, or communicate with other users:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>Full name and email address</ListItem>
                  <ListItem>Phone number (for service providers)</ListItem>
                  <ListItem>Profile information including service type, location, and business details</ListItem>
                  <ListItem>Verification documents (NIN, selfie photo) for provider verification</ListItem>
                  <ListItem>Messages exchanged with other users on the platform</ListItem>
                  <ListItem>Device and browser information for security purposes</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={Eye}
            title="How We Use Your Information"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  Your information is used strictly to provide and improve our services:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>To verify the identity of service providers</ListItem>
                  <ListItem>To connect customers with relevant service providers in their area</ListItem>
                  <ListItem>To facilitate communication between customers and providers</ListItem>
                  <ListItem>To send important notifications about your account and services</ListItem>
                  <ListItem>To improve our platform and prevent fraudulent activity</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={Lock}
            title="Data Protection"
            content={
              <p className="text-[14px] text-[#55605A] leading-relaxed">
                We implement industry-standard security measures to protect your personal information. Your verification documents are stored securely on Cloudinary with encrypted access. We do not share your NIN, selfie, or verification documents with other users. Only authorized administrators can access verification documents for the purpose of profile approval. All messages on the platform are monitored to prevent sharing of personal contact information, protecting both parties from potential fraud.
              </p>
            }
          />

          <Section
            icon={Mail}
            title="Your Rights"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>Access and download your personal information</ListItem>
                  <ListItem>Update or correct inaccurate information</ListItem>
                  <ListItem>Request deletion of your account and associated data</ListItem>
                  <ListItem>Opt out of non-essential communications</ListItem>
                  <ListItem>Know how your data is being used</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={Shield}
            title="Third-Party Services"
            content={
              <p className="text-[14px] text-[#55605A] leading-relaxed">
                We use trusted third-party services to operate our platform. These include Cloudinary for document storage, Resend for email delivery, and MongoDB Atlas for database hosting. These services have their own privacy policies and security measures. We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
            }
          />
        </div>

        {/* Contact */}
        <div className="mt-12 p-6 bg-white border border-[#E2E0D9] rounded-xl">
          <h3 className="text-[15px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif] mb-2">
            Questions About Our Privacy Policy?
          </h3>
          <p className="text-[13px] text-[#55605A]">
            Contact us at{" "}
            <a href="mailto:privacy@9jatradiespages.com" className="text-[#1E7A34] hover:underline">
              info@9jatradiespages.com
            </a>
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

function Section({ icon: Icon, title, content }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-5 w-5 text-[#1E7A34]" />
        <h2 className="text-[18px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">
          {title}
        </h2>
      </div>
      <div className="pl-8">{content}</div>
    </div>
  );
}

function ListItem({ children }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1E7A34] flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default PrivacyPolicy;