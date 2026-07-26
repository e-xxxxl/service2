// components/legal/TermsOfService.jsx
import { Scale, Users, Shield, AlertCircle, Ban, Mail } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#F5F4F0]">
        <Navbar/>
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="h-6 w-6 text-[#1E7A34]" />
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9A9488] font-['IBM_Plex_Mono',monospace]">
              Last updated: July 2026
            </span>
          </div>
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1E2420] font-['Space_Grotesk',sans-serif] leading-tight">
            Terms of Service
          </h1>
          <p className="text-[15px] text-[#55605A] mt-4 leading-relaxed">
            By using 9jaTradiesPages, you agree to these terms. Please read them carefully before using our platform.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          <Section
            icon={Users}
            title="Account Registration"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  When you create an account, you agree to:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>Provide accurate and complete information during registration</ListItem>
                  <ListItem>Maintain the security of your account credentials</ListItem>
                  <ListItem>Not share your account with others or create multiple accounts</ListItem>
                  <ListItem>Be at least 18 years of age to use our services</ListItem>
                  <ListItem>Update your information promptly if it changes</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={Shield}
            title="Service Provider Requirements"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  Service providers on our platform must:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>Submit valid NIN documentation and a clear selfie for verification</ListItem>
                  <ListItem>Provide accurate service descriptions and pricing information</ListItem>
                  <ListItem>Maintain professional conduct when interacting with customers</ListItem>
                  <ListItem>Complete jobs as agreed upon with customers</ListItem>
                  <ListItem>Not share personal contact information through platform messages</ListItem>
                  <ListItem>Respond to customer inquiries in a timely manner</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={AlertCircle}
            title="Customer Responsibilities"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  Customers using our platform agree to:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>Provide clear and accurate job descriptions</ListItem>
                  <ListItem>Communicate professionally with service providers</ListItem>
                  <ListItem>Not share personal contact information through platform messages</ListItem>
                  <ListItem>Report any issues or disputes through the platform</ListItem>
                  <ListItem>Pay for services as agreed upon with the provider</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={Ban}
            title="Prohibited Conduct"
            content={
              <>
                <p className="text-[14px] text-[#55605A] leading-relaxed mb-3">
                  The following actions are strictly prohibited:
                </p>
                <ul className="space-y-2 text-[14px] text-[#55605A]">
                  <ListItem>Sharing phone numbers, emails, or external contact information in messages</ListItem>
                  <ListItem>Harassing, threatening, or abusing other users</ListItem>
                  <ListItem>Posting false or misleading information</ListItem>
                  <ListItem>Attempting to bypass platform verification or security measures</ListItem>
                  <ListItem>Using the platform for illegal activities</ListItem>
                  <ListItem>Spamming or sending unsolicited commercial messages</ListItem>
                </ul>
              </>
            }
          />

          <Section
            icon={Shield}
            title="Platform Liability"
            content={
              <p className="text-[14px] text-[#55605A] leading-relaxed">
                9jaTradiesPages acts as a connection platform between customers and service providers. We verify provider identities but do not guarantee the quality of services rendered. We are not liable for disputes between users, damages, or losses resulting from service engagements. Users are encouraged to exercise due diligence and communicate clearly through the platform. We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            }
          />

          <Section
            icon={Scale}
            title="Termination"
            content={
              <p className="text-[14px] text-[#55605A] leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any conduct that we deem harmful to the platform or other users. Upon termination, your right to use the platform ceases immediately. You may also request account deletion at any time by contacting our support team.
              </p>
            }
          />
        </div>

        {/* Contact */}
        <div className="mt-12 p-6 bg-white border border-[#E2E0D9] rounded-xl">
          <h3 className="text-[15px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif] mb-2">
            Questions About These Terms?
          </h3>
          <p className="text-[13px] text-[#55605A]">
            Contact us at{" "}
            <a href="mailto:legal@9jatradiespages.com" className="text-[#1E7A34] hover:underline">
              legal@9jatradiespages.com
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

export default TermsOfService;