// components/provider/ProviderSetup.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Upload, CheckCircle, AlertCircle, ArrowRight,
  Shield, MapPin, Phone, User, Briefcase, Tag, CreditCard
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "Abuja (FCT)"
];

export default function ProviderSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    serviceType: '',
    tagline: '',
    ninNumber: '',
    street: '',
    city: '',
    state: '',
    phone: ''
  });

  const [ninDocument, setNinDocument] = useState(null);
  const [selfiePhoto, setSelfiePhoto] = useState(null);
  const [ninPreview, setNinPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'nin') {
      setNinDocument(file);
      setNinPreview(URL.createObjectURL(file));
    } else {
      setSelfiePhoto(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.serviceType) return 'Please select a service category';
      if (!formData.tagline?.trim()) return 'Please add a tagline';
    }
    if (step === 2) {
      if (!formData.ninNumber?.trim()) return 'NIN number is required';
      if (!ninDocument) return 'Please upload your NIN document';
      if (!selfiePhoto) return 'Please upload a clear selfie';
    }
    if (step === 3) {
      if (!formData.state?.trim()) return 'State is required';
      if (!formData.city?.trim()) return 'City is required';
      if (!formData.phone?.trim()) return 'Phone number is required';
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append files
      if (ninDocument) formDataToSend.append('ninDocument', ninDocument);
      if (selfiePhoto) formDataToSend.append('selfiePhoto', selfiePhoto);

      const res = await fetch(`${API_URL}/provider/setup-profile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess('Profile submitted for verification! You\'ll be notified once approved.');
      setTimeout(() => navigate('/provider-dashboard'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-[#E2E0D9] p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-semibold text-[#1E2420]">Profile Setup</span>
            <span className="text-[12px] text-[#9A9488]">{progressPercent}% Complete</span>
          </div>
          <div className="h-2 w-full bg-[#EFEDE6] rounded-full overflow-hidden">
            <div className="h-full bg-[#1E7A34] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex items-center gap-1.5 text-[11px] ${step >= s ? 'text-[#1E7A34]' : 'text-[#9A9488]'}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= s ? 'bg-[#1E7A34] text-white' : 'bg-[#EFEDE6]'}`}>
                  {step > s ? '✓' : s}
                </div>
                {s === 1 ? 'Service' : s === 2 ? 'Verification' : 'Contact'}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-[13px] text-green-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" /> {success}
          </div>
        )}

        {/* Step 1: Service & Tagline */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">What service do you provide?</h2>
            
            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Service Category *</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange}
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]">
                <option value="">Select your service</option>
                {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => (
                  <optgroup key={category} label={category}>
                    {services.map(service => (
                      <option key={service} value={service.toLowerCase()}>{service}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Tagline *</label>
              <input type="text" name="tagline" value={formData.tagline} onChange={handleChange}
                placeholder="e.g., Professional plumbing services you can trust"
                maxLength={200}
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]" />
              <p className="text-[11px] text-[#9A9488] mt-1">{formData.tagline.length}/200</p>
            </div>

            <button onClick={() => { const err = validateStep(); if (err) setError(err); else { setError(''); setStep(2); } }}
              className="w-full bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] flex items-center justify-center gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2: NIN & Selfie */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">Identity Verification</h2>
            <p className="text-[13px] text-[#55605A]">This helps us verify you're a real service provider. Only admins can see these documents.</p>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">NIN Number *</label>
              <input type="text" name="ninNumber" value={formData.ninNumber} onChange={handleChange}
                placeholder="Enter your 11-digit NIN"
                maxLength={11}
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]" />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">NIN Document / Slip *</label>
              <div className="border-2 border-dashed border-[#D8D5CB] rounded-xl p-6 text-center hover:border-[#1E7A34] transition-colors cursor-pointer"
                onClick={() => document.getElementById('ninUpload').click()}>
                {ninPreview ? (
                  <img src={ninPreview} alt="NIN preview" className="max-h-[200px] mx-auto rounded-lg" />
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-[#9A9488] mx-auto mb-2" />
                    <p className="text-[13px] text-[#55605A]">Click to upload NIN document</p>
                    <p className="text-[11px] text-[#9A9488]">JPG, PNG or PDF (max 5MB)</p>
                  </div>
                )}
              </div>
              <input id="ninUpload" type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'nin')} />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Clear Selfie / Headshot *</label>
              <div className="border-2 border-dashed border-[#D8D5CB] rounded-xl p-6 text-center hover:border-[#1E7A34] transition-colors cursor-pointer"
                onClick={() => document.getElementById('selfieUpload').click()}>
                {selfiePreview ? (
                  <img src={selfiePreview} alt="Selfie preview" className="max-h-[200px] mx-auto rounded-lg" />
                ) : (
                  <div>
                    <Camera className="h-8 w-8 text-[#9A9488] mx-auto mb-2" />
                    <p className="text-[13px] text-[#55605A]">Click to upload your photo</p>
                    <p className="text-[11px] text-[#9A9488]">Clear face photo (JPG, PNG)</p>
                  </div>
                )}
              </div>
              <input id="selfieUpload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'selfie')} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-[#E2E0D9] py-3 rounded-xl text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2]">
                Back
              </button>
              <button onClick={() => { const err = validateStep(); if (err) setError(err); else { setError(''); setStep(3); } }}
                className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C]">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Address */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">Contact & Location</h2>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">State *</label>
              <select name="state" value={formData.state} onChange={handleChange}
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]">
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange}
                placeholder="e.g., Ikeja, Lekki"
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]" />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Street Address</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange}
                placeholder="Your business address"
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]" />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1E2420] mb-2">Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+234 800 000 0000"
                className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] focus:outline-none focus:border-[#1E7A34]" />
            </div>

            <div className="bg-[#FFF8F0] border border-[#F0821E]/20 rounded-xl p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#F0821E] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#1E2420]">Almost done!</p>
                <p className="text-[12px] text-[#55605A]">Your profile will be reviewed by our team. You'll be notified once approved. This usually takes 24-48 hours.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-[#E2E0D9] py-3 rounded-xl text-[14px] font-semibold text-[#55605A] hover:bg-[#F7F6F2]">
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Submitting...' : <>Submit for Review <CheckCircle className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}