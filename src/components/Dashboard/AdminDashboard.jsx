// components/admin/AdminDashboard.jsx - MOBILE RESPONSIVE
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Briefcase, CheckCircle, Clock,
  Search, Shield, Ban, Trash2, LogOut, X, AlertCircle,
  Eye, Check, ChevronRight, RefreshCw, Mail, Phone, MapPin,
  Star, Image, FileText, Activity, Menu, ChevronLeft
} from "lucide-react";
import logo from "../../assets/dashlogo.png";

const NAV_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "providers", label: "Providers", icon: Briefcase },
  { id: "users", label: "Users", icon: Users },
  { id: "settings", label: "Settings", icon: Shield },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('authToken');

  const showMessage = (setter, msg) => { setter(msg); setTimeout(() => setter(''), 4000); };

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => { if (activeView === 'users') fetchUsers(); if (activeView === 'providers') fetchProviders(); }, [activeView, page, searchTerm, filterStatus]);

  // Close sidebar when view changes on mobile
  useEffect(() => { setSidebarOpen(false); }, [activeView]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setDashboardData(data.data);
    } catch (err) { showMessage(setError, err.message); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search: searchTerm, accountType: filterStatus !== 'all' ? filterStatus : '' });
      const res = await fetch(`${API_URL}/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setUsers(data.data); setTotalPages(data.pagination?.pages || 1); }
    } catch (err) { showMessage(setError, err.message); }
    finally { setLoading(false); }
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search: searchTerm });
      if (filterStatus === 'submitted') params.append('verificationStatus', 'submitted');
      if (filterStatus === 'approved') params.append('verificationStatus', 'approved');
      if (filterStatus === 'rejected') params.append('verificationStatus', 'rejected');
      
      const res = await fetch(`${API_URL}/admin/providers?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { setProviders(data.data); setTotalPages(data.pagination?.pages || 1); }
    } catch (err) { showMessage(setError, err.message); }
    finally { setLoading(false); }
  };

  const approveProvider = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/providers/${id}/approve`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) { showMessage(setSuccess, 'Provider approved!'); fetchProviders(); fetchDashboard(); }
      else showMessage(setError, data.message);
    } catch (err) { showMessage(setError, err.message); }
  };

  const rejectProvider = async () => {
    if (!rejectReason.trim()) return showMessage(setError, 'Please provide a reason');
    try {
      const res = await fetch(`${API_URL}/admin/providers/${selectedProvider}/reject`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await res.json();
      if (data.success) { showMessage(setSuccess, 'Provider rejected'); setShowRejectModal(false); setRejectReason(''); fetchProviders(); fetchDashboard(); }
      else showMessage(setError, data.message);
    } catch (err) { showMessage(setError, err.message); }
  };

  const toggleUserStatus = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/toggle-status`, {
        method: 'PATCH', headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) { showMessage(setSuccess, data.message); fetchUsers(); }
    } catch (err) { showMessage(setError, err.message); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) { showMessage(setSuccess, 'User deleted'); fetchUsers(); fetchDashboard(); }
    } catch (err) { showMessage(setError, err.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/admin/login';
  };

  const viewProviderDetails = (provider) => { setSelectedProvider(provider); };

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-600'
    };
    return styles[status] || styles.pending;
  };

  // Mobile card for providers
  const ProviderMobileCard = ({ provider }) => (
    <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[14px] font-semibold text-[#F0821E]">{provider.companyName?.[0]}</div>
          <div>
            <p className="text-[14px] font-semibold">{provider.companyName}</p>
            <p className="text-[11px] text-[#9A9488]">{provider.user?.fullName}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(provider.verificationStatus)}`}>
          {provider.verificationStatus || 'pending'}
        </span>
      </div>
      <div className="text-[12px] text-[#55605A] space-y-1">
        <p>📋 {provider.serviceType}</p>
        <p>📍 {provider.city}, {provider.state}</p>
      </div>
      <div className="flex gap-2 pt-2 border-t border-[#E2E0D9]">
        <button onClick={() => viewProviderDetails(provider)} className="flex-1 py-2 rounded-lg border border-[#E2E0D9] text-[12px] font-medium text-[#55605A] hover:bg-[#F7F6F2]">View</button>
        {provider.verificationStatus === 'submitted' && (
          <button onClick={() => approveProvider(provider._id)} className="flex-1 py-2 rounded-lg bg-[#1E7A34] text-[12px] font-medium text-white hover:bg-[#166B2C]">Approve</button>
        )}
      </div>
    </div>
  );

  // Mobile card for users
  const UserMobileCard = ({ user }) => (
    <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[14px] font-semibold">{user.fullName?.[0]}</div>
          <div>
            <p className="text-[14px] font-semibold">{user.fullName}</p>
            <p className="text-[11px] text-[#9A9488]">{user.email}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {user.isActive ? 'Active' : 'Disabled'}
        </span>
      </div>
      <div className="text-[12px] text-[#55605A]">
        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${user.accountType === 'provider' ? 'bg-[#F0821E]/10 text-[#F0821E]' : 'bg-[#1E7A34]/10 text-[#1E7A34]'}`}>{user.accountType}</span>
        <span className="ml-2">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex gap-2 pt-2 border-t border-[#E2E0D9]">
        <button onClick={() => toggleUserStatus(user._id)} className="flex-1 py-2 rounded-lg border border-[#E2E0D9] text-[12px] font-medium text-[#55605A] hover:bg-[#F7F6F2]">{user.isActive ? 'Deactivate' : 'Activate'}</button>
        <button onClick={() => deleteUser(user._id)} className="py-2 px-4 rounded-lg border border-red-200 text-[12px] font-medium text-red-600 hover:bg-red-50">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 z-50 h-screen w-[260px] bg-[#1E2420] text-white flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8" />
            <span className="text-[14px] font-semibold font-['Space_Grotesk',sans-serif]">9jaTradiesPages</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_CONFIG.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveView(item.id); setPage(1); setSearchTerm(''); setFilterStatus('all'); setSelectedProvider(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all ${
                  isActive ? 'bg-[#F0821E] text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}>
                <Icon className="h-4 w-4" /> {item.label}
                {item.id === 'providers' && dashboardData?.stats?.pendingVerifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {dashboardData.stats.pendingVerifications}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] text-white/60 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {/* Topbar */}
        <div className="bg-white border-b border-[#E2E0D9] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[#55605A] hover:text-[#1E2420]">
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-[16px] md:text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">
              {NAV_CONFIG.find(n => n.id === activeView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
              <input type="text" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                placeholder="Search..." className="pl-10 pr-4 py-2 rounded-lg border border-[#E2E0D9] text-[13px] w-[180px] md:w-[250px] focus:outline-none focus:border-[#1E7A34]" />
            </div>
            <div className="h-9 w-9 rounded-full bg-[#F0821E] flex items-center justify-center text-white text-[13px] font-semibold">A</div>
          </div>
        </div>

        {/* Search for mobile */}
        <div className="px-4 pt-4 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
            <input type="text" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E0D9] text-[13px] focus:outline-none focus:border-[#1E7A34]" />
          </div>
        </div>

        <div className="p-4 md:p-8">
          {/* Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> <span className="truncate">{error}</span>
              <button onClick={() => setError('')} className="ml-auto flex-shrink-0"><X className="h-4 w-4" /></button>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-[13px] text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" /> <span className="truncate">{success}</span>
              <button onClick={() => setSuccess('')} className="ml-auto flex-shrink-0"><X className="h-4 w-4" /></button>
            </div>
          )}

          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                <StatCard icon={Users} label="Total Users" value={dashboardData?.stats?.totalUsers || 0} color="blue" />
                <StatCard icon={Briefcase} label="Providers" value={dashboardData?.stats?.totalProviders || 0} color="green" />
                <StatCard icon={Clock} label="Pending" value={dashboardData?.stats?.pendingVerifications || 0} color="orange" />
                <StatCard icon={CheckCircle} label="Verified" value={dashboardData?.stats?.verifiedProviders || 0} color="purple" />
              </div>

              {(dashboardData?.stats?.pendingVerifications || 0) > 0 && (
                <div className="mb-6 md:mb-8 bg-[#FFF8F0] border border-[#F0821E]/20 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#F0821E] flex-shrink-0" />
                    <div>
                      <p className="text-[13px] md:text-[14px] font-semibold">{dashboardData.stats.pendingVerifications} providers waiting</p>
                      <p className="text-[11px] md:text-[12px] text-[#55605A]">Review them in the Providers tab</p>
                    </div>
                  </div>
                  <button onClick={() => { setActiveView('providers'); setFilterStatus('submitted'); }}
                    className="rounded-lg bg-[#F0821E] px-4 py-2 text-[12px] md:text-[13px] font-semibold text-white hover:bg-[#D5720F] whitespace-nowrap">
                    Review Now
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] md:text-[15px] font-semibold">Recent Users</h3>
                    <button onClick={() => setActiveView('users')} className="text-[11px] md:text-[12px] text-[#1E7A34] hover:underline">View all</button>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {(dashboardData?.recentUsers || []).slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-[#F7F6F2]">
                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[11px] md:text-[12px] font-semibold flex-shrink-0">{user.fullName?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] md:text-[13px] font-semibold truncate">{user.fullName}</p>
                          <p className="text-[10px] md:text-[11px] text-[#9A9488] truncate">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-semibold whitespace-nowrap ${user.accountType === 'provider' ? 'bg-[#F0821E]/10 text-[#F0821E]' : 'bg-[#1E7A34]/10 text-[#1E7A34]'}`}>{user.accountType}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] md:text-[15px] font-semibold">Recent Providers</h3>
                    <button onClick={() => setActiveView('providers')} className="text-[11px] md:text-[12px] text-[#1E7A34] hover:underline">View all</button>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {(dashboardData?.recentProviders || []).slice(0, 5).map(provider => (
                      <div key={provider.id} className="flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-[#F7F6F2]">
                        <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[11px] md:text-[12px] font-semibold text-[#F0821E] flex-shrink-0">{provider.companyName?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] md:text-[13px] font-semibold truncate">{provider.companyName}</p>
                          <p className="text-[10px] md:text-[11px] text-[#9A9488] truncate">{provider.serviceType} · {provider.city}, {provider.state}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-semibold whitespace-nowrap ${getStatusBadge(provider.verificationStatus)}`}>{provider.verificationStatus || 'pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Providers View */}
          {activeView === "providers" && (
            <div>
              <div className="flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
                {['all', 'submitted', 'approved', 'rejected'].map(status => (
                  <button key={status} onClick={() => { setFilterStatus(status); setPage(1); }}
                    className={`px-3 md:px-4 py-2 rounded-lg text-[12px] md:text-[13px] font-medium whitespace-nowrap transition-all ${
                      filterStatus === status ? 'bg-[#1E2420] text-white' : 'bg-white border border-[#E2E0D9] text-[#55605A] hover:bg-[#F7F6F2]'
                    }`}>
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    {status === 'submitted' && dashboardData?.stats?.pendingVerifications > 0 && (
                      <span className="ml-1.5 bg-[#F0821E] text-white text-[10px] px-1.5 py-0.5 rounded-full">{dashboardData.stats.pendingVerifications}</span>
                    )}
                  </button>
                ))}
              </div>

              {selectedProvider ? (
                <div>
                  <button onClick={() => setSelectedProvider(null)} className="flex items-center gap-2 text-[13px] text-[#55605A] hover:text-[#1E2420] mb-4 md:mb-6">
                    <ChevronLeft className="h-4 w-4" /> Back to list
                  </button>
                  
                  <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-[#F0821E]/10 flex items-center justify-center text-[20px] md:text-[24px] font-bold text-[#F0821E] flex-shrink-0">{selectedProvider.companyName?.[0]}</div>
                        <div>
                          <h3 className="text-[16px] md:text-[18px] font-semibold">{selectedProvider.companyName}</h3>
                          <p className="text-[12px] md:text-[13px] text-[#55605A]">{selectedProvider.user?.fullName}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(selectedProvider.verificationStatus)}`}>{selectedProvider.verificationStatus}</span>
                        </div>
                      </div>
                      {selectedProvider.verificationStatus === 'submitted' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button onClick={() => approveProvider(selectedProvider._id)}
                            className="flex-1 sm:flex-none rounded-lg bg-[#1E7A34] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#166B2C] flex items-center justify-center gap-1">
                            <Check className="h-4 w-4" /> Approve
                          </button>
                          <button onClick={() => { setShowRejectModal(true); }}
                            className="flex-1 sm:flex-none rounded-lg border border-red-300 px-4 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1">
                            <X className="h-4 w-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <DetailSection title="Contact Info">
                        <DetailItem icon={Mail} label="Email" value={selectedProvider.user?.email} />
                        <DetailItem icon={Phone} label="Phone" value={selectedProvider.user?.phone || 'N/A'} />
                        <DetailItem icon={MapPin} label="Location" value={`${selectedProvider.city || ''}, ${selectedProvider.state || ''}`} />
                      </DetailSection>
                      <DetailSection title="Business Info">
                        <DetailItem icon={Briefcase} label="Service" value={selectedProvider.serviceType} />
                        <DetailItem icon={Star} label="Rating" value={selectedProvider.rating || '0'} />
                        <DetailItem icon={Activity} label="Jobs Completed" value={selectedProvider.completedJobs || '0'} />
                      </DetailSection>
                      <DetailSection title="Verification Documents">
                        {selectedProvider.verificationDocuments?.map((doc, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {doc.type === 'nin' ? <FileText className="h-4 w-4 text-[#55605A]" /> : <Image className="h-4 w-4 text-[#55605A]" />}
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1E7A34] hover:underline">
                              View {doc.type === 'nin' ? 'NIN Document' : 'Selfie Photo'}
                            </a>
                          </div>
                        ))}
                        {(!selectedProvider.verificationDocuments || selectedProvider.verificationDocuments.length === 0) && (
                          <p className="text-[13px] text-[#9A9488]">No documents uploaded</p>
                        )}
                      </DetailSection>
                      <DetailSection title="NIN Info">
                        <DetailItem icon={FileText} label="NIN Number" value={selectedProvider.nin?.number || 'N/A'} />
                      </DetailSection>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#F7F6F2]">
                        <tr>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Provider</th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Service</th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Location</th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Status</th>
                          <th className="text-right px-6 py-3 text-[12px] font-semibold text-[#55605A]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="5" className="text-center py-12 text-[#9A9488]">Loading...</td></tr>
                        ) : providers.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-12 text-[#9A9488]">No providers found</td></tr>
                        ) : providers.map(provider => (
                          <tr key={provider._id} className="border-t border-[#E2E0D9] hover:bg-[#F7F6F2]">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[11px] font-semibold text-[#F0821E]">{provider.companyName?.[0]}</div>
                                <div><p className="text-[13px] font-medium">{provider.companyName}</p><p className="text-[11px] text-[#9A9488]">{provider.user?.fullName}</p></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px]">{provider.serviceType}</td>
                            <td className="px-6 py-4 text-[12px] text-[#9A9488]">{provider.city}, {provider.state}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(provider.verificationStatus)}`}>{provider.verificationStatus || 'pending'}</span></td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => viewProviderDetails(provider)} className="p-1.5 rounded-lg hover:bg-[#EFEDE6]" title="View details"><Eye className="h-4 w-4 text-[#55605A]" /></button>
                                {provider.verificationStatus === 'submitted' && (
                                  <button onClick={() => approveProvider(provider._id)} className="p-1.5 rounded-lg hover:bg-green-50" title="Approve"><Check className="h-4 w-4 text-green-600" /></button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3">
                    {loading ? (
                      <p className="text-center py-12 text-[#9A9488]">Loading...</p>
                    ) : providers.length === 0 ? (
                      <p className="text-center py-12 text-[#9A9488]">No providers found</p>
                    ) : providers.map(provider => (
                      <ProviderMobileCard key={provider._id} provider={provider} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-xl border border-[#E2E0D9]">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="text-[12px] text-[#55605A] hover:text-[#1E2420] disabled:opacity-30">Previous</button>
                      <span className="text-[12px] text-[#9A9488]">Page {page} of {totalPages}</span>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="text-[12px] text-[#55605A] hover:text-[#1E2420] disabled:opacity-30">Next</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Users View */}
          {activeView === "users" && (
            <div>
              <div className="flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
                {['all', 'customer', 'provider'].map(type => (
                  <button key={type} onClick={() => { setFilterStatus(type); setPage(1); }}
                    className={`px-3 md:px-4 py-2 rounded-lg text-[12px] md:text-[13px] font-medium whitespace-nowrap ${filterStatus === type ? 'bg-[#1E2420] text-white' : 'bg-white border border-[#E2E0D9] text-[#55605A] hover:bg-[#F7F6F2]'}`}>
                    {type === 'all' ? 'All Users' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                  </button>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F7F6F2]">
                    <tr>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">User</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Email</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Type</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Status</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">Joined</th>
                      <th className="text-right px-6 py-3 text-[12px] font-semibold text-[#55605A]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="text-center py-12 text-[#9A9488]">Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-12 text-[#9A9488]">No users found</td></tr>
                    ) : users.map(user => (
                      <tr key={user._id} className="border-t border-[#E2E0D9] hover:bg-[#F7F6F2]">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[11px] font-semibold">{user.fullName?.[0]}</div><span className="text-[13px] font-medium">{user.fullName}</span></div></td>
                        <td className="px-6 py-4 text-[13px] text-[#55605A]">{user.email}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${user.accountType === 'provider' ? 'bg-[#F0821E]/10 text-[#F0821E]' : 'bg-[#1E7A34]/10 text-[#1E7A34]'}`}>{user.accountType}</span></td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.isActive ? 'Active' : 'Disabled'}</span></td>
                        <td className="px-6 py-4 text-[12px] text-[#9A9488]">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => toggleUserStatus(user._id)} className="p-1.5 rounded-lg hover:bg-[#EFEDE6]" title="Toggle status"><Ban className="h-4 w-4 text-[#55605A]" /></button>
                            <button onClick={() => deleteUser(user._id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4 text-red-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {loading ? (
                  <p className="text-center py-12 text-[#9A9488]">Loading...</p>
                ) : users.length === 0 ? (
                  <p className="text-center py-12 text-[#9A9488]">No users found</p>
                ) : users.map(user => (
                  <UserMobileCard key={user._id} user={user} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-xl border border-[#E2E0D9]">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-[12px] text-[#55605A] hover:text-[#1E2420] disabled:opacity-30">Previous</button>
                  <span className="text-[12px] text-[#9A9488]">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-[12px] text-[#55605A] hover:text-[#1E2420] disabled:opacity-30">Next</button>
                </div>
              )}
            </div>
          )}

          {/* Settings View */}
          {activeView === "settings" && (
            <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6 max-w-2xl">
              <h3 className="text-[16px] md:text-[18px] font-semibold mb-4 md:mb-6 font-['Space_Grotesk',sans-serif]">Admin Settings</h3>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[12px] md:text-[13px] font-semibold mb-2">Site Name</label>
                  <input type="text" defaultValue="9jaTradiesPages" className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[13px] md:text-[14px]" />
                </div>
                <div>
                  <label className="block text-[12px] md:text-[13px] font-semibold mb-2">Support Email</label>
                  <input type="email" defaultValue="support@9jatradiespages.com" className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[13px] md:text-[14px]" />
                </div>
                <button className="rounded-lg bg-[#1E7A34] px-6 py-2.5 text-[13px] md:text-[14px] font-semibold text-white hover:bg-[#166B2C]">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-[16px] font-semibold mb-4">Reject Provider</h3>
            <p className="text-[13px] text-[#55605A] mb-4">Please provide a reason for rejection.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              rows={3} placeholder="e.g., NIN document is not clear..."
              className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] resize-none focus:outline-none focus:border-red-300" />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="px-4 py-2 rounded-lg border border-[#E2E0D9] text-[13px] font-semibold text-[#55605A]">Cancel</button>
              <button onClick={rejectProvider}
                className="px-4 py-2 rounded-lg bg-red-600 text-[13px] font-semibold text-white hover:bg-red-700">Reject Provider</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200", green: "bg-green-50 border-green-200",
    orange: "bg-orange-50 border-orange-200", purple: "bg-purple-50 border-purple-200"
  };
  const iconColors = { blue: "text-blue-600", green: "text-green-600", orange: "text-orange-600", purple: "text-purple-600" };
  return (
    <div className={`rounded-xl border p-3 md:p-6 ${colors[color] || colors.green}`}>
      <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColors[color] || iconColors.green} mb-2 md:mb-3`} />
      <p className="text-[22px] md:text-[28px] font-bold font-['Space_Grotesk',sans-serif]">{value}</p>
      <p className="text-[11px] md:text-[13px] text-[#55605A] mt-1">{label}</p>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div className="space-y-2 md:space-y-3">
      <h4 className="text-[11px] md:text-[12px] font-semibold uppercase text-[#9A9488]">{title}</h4>
      <div className="space-y-1.5 md:space-y-2">{children}</div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#9A9488]" />
      <span className="text-[11px] md:text-[12px] text-[#9A9488]">{label}:</span>
      <span className="text-[12px] md:text-[13px] font-medium break-all">{value}</span>
    </div>
  );
}