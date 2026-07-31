// components/dashboard/ProviderProfileModal.jsx
import { useEffect, useState } from "react";
import {
  X, MapPin, Star, Clock, Briefcase, User, Phone, Mail,
  CheckCircle2, MessageCircle, Heart, Shield, Calendar
} from "lucide-react";

export default function ProviderProfileModal({ providerId, onClose, onMessage, onToggleFavorite }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || 'https://service-server-e64r.onrender.com/api';

  useEffect(() => {
    if (!providerId) return;
    fetchProvider();
  }, [providerId]);

  const fetchProvider = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/customer/provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setProvider(data.data);
      else setError(data.message);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center">
          <div className="w-8 h-8 border-2 border-[#1E7A34] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[14px] text-[#55605A] mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center">
          <p className="text-[14px] text-red-600">{error || 'Provider not found'}</p>
          <button onClick={onClose} className="mt-4 text-[13px] text-[#1E7A34] hover:underline">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg my-8">
        {/* Close button */}
        <div className="sticky top-0 bg-white rounded-t-2xl z-10 flex items-center justify-between p-4 border-b">
          <h3 className="text-[15px] font-semibold font-['Space_Grotesk',sans-serif]">Provider Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]"><X className="h-5 w-5 text-[#55605A]" /></button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              {provider.profilePicture ? (
                <img src={provider.profilePicture} alt={provider.fullName} className="h-20 w-20 rounded-xl object-cover" />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-[#1E2420] flex items-center justify-center text-[24px] font-bold text-white font-['Space_Grotesk',sans-serif]">
                  {(provider.fullName || provider.companyName || "P")[0]}
                </div>
              )}
              {provider.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-[#1E7A34] rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-semibold text-[#1E2420] font-['Space_Grotesk',sans-serif]">{provider.fullName}</h2>
              {provider.companyName && provider.companyName !== provider.fullName && (
                <p className="text-[13px] text-[#9A9488]">{provider.companyName}</p>
              )}
              <p className="text-[14px] text-[#55605A] mt-0.5">{provider.trade || provider.serviceType}</p>
              {provider.tagline && (
                <p className="text-[13px] text-[#1E7A34] italic mt-1">"{provider.tagline}"</p>
              )}
            </div>
            <button onClick={() => onToggleFavorite?.(provider, !provider.isFavorited)}
              className={`p-2 rounded-lg ${provider.isFavorited ? 'text-[#F0821E]' : 'text-[#9A9488] hover:text-[#F0821E]'}`}>
              <Heart className={`h-5 w-5 ${provider.isFavorited ? 'fill-[#F0821E]' : ''}`} />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#F7F6F2] rounded-xl p-3 text-center">
              <Star className="h-4 w-4 text-[#F0821E] mx-auto mb-1" />
              <p className="text-[14px] font-bold">{provider.rating?.toFixed(1) || '0.0'}</p>
              <p className="text-[10px] text-[#9A9488]">Rating</p>
            </div>
            <div className="bg-[#F7F6F2] rounded-xl p-3 text-center">
              <Briefcase className="h-4 w-4 text-[#1E7A34] mx-auto mb-1" />
              <p className="text-[14px] font-bold">{provider.completedJobs || 0}</p>
              <p className="text-[10px] text-[#9A9488]">Jobs Done</p>
            </div>
            <div className="bg-[#F7F6F2] rounded-xl p-3 text-center">
              <Clock className="h-4 w-4 text-[#2563EB] mx-auto mb-1" />
              <p className="text-[14px] font-bold">{provider.yearsOfExperience || 0}yrs</p>
              <p className="text-[10px] text-[#9A9488]">Experience</p>
            </div>
          </div>

          {/* About */}
          {provider.businessDescription && (
            <div className="mb-5">
              <h4 className="text-[13px] font-semibold text-[#1E2420] mb-2">About</h4>
              <p className="text-[13px] text-[#55605A] leading-relaxed">{provider.businessDescription}</p>
            </div>
          )}

          {/* Services Offered */}
          {provider.servicesOffered && provider.servicesOffered.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[13px] font-semibold text-[#1E2420] mb-2">Services Offered</h4>
              <div className="flex flex-wrap gap-2">
                {provider.servicesOffered.map((service, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#F7F6F2] border border-[#E2E0D9] rounded-lg text-[12px] text-[#55605A]">
                    {service.name || service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Location */}
          <div className="space-y-3 mb-6">
            <h4 className="text-[13px] font-semibold text-[#1E2420]">Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[13px] text-[#55605A]">
                <MapPin className="h-4 w-4 text-[#9A9488]" />
                <span>{provider.location || 'Location not specified'}</span>
              </div>
              {/* {provider.phone && (
                <div className="flex items-center gap-2 text-[13px] text-[#55605A]">
                  <Phone className="h-4 w-4 text-[#9A9488]" />
                  <span>{provider.phone}</span>
                </div>
              )} */}
              <div className="flex items-center gap-2 text-[13px] text-[#55605A]">
                <User className="h-4 w-4 text-[#9A9488]" />
                <span>Team size: {provider.teamSize || 1}</span>
              </div>
              {provider.lastActive && (
                <div className="flex items-center gap-2 text-[13px] text-[#55605A]">
                  <Calendar className="h-4 w-4 text-[#9A9488]" />
                  <span>Last active: {new Date(provider.lastActive).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`h-2 w-2 rounded-full ${provider.isAvailable ? 'bg-[#1E7A34]' : 'bg-[#9A9488]'}`} />
            <span className="text-[13px] text-[#55605A]">{provider.status}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={() => { onMessage?.(provider); onClose?.(); }}
              className="flex-1 bg-[#1E7A34] text-white py-3 rounded-xl text-[14px] font-semibold hover:bg-[#166B2C] flex items-center justify-center gap-2">
              <MessageCircle className="h-4 w-4" /> Message
            </button>
            <button onClick={() => onToggleFavorite?.(provider, !provider.isFavorited)}
              className={`px-4 py-3 rounded-xl border text-[14px] font-semibold ${provider.isFavorited ? 'border-[#F0821E] text-[#F0821E] bg-[#FFF8F0]' : 'border-[#E2E0D9] text-[#55605A] hover:bg-[#F7F6F2]'}`}>
              {provider.isFavorited ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-[#F7F6F2] rounded-xl flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#9A9488]" />
            <p className="text-[11px] text-[#9A9488]">Messages are monitored. Sharing contact info is not allowed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}