// components/dashboard/AdminDashboard.jsx
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Search,
  Shield,
  Ban,
  Trash2,
  LogOut,
  X,
  AlertCircle,
  Eye,
  Check,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Star,
  Image,
  FileText,
  Activity,
  MessageCircle,
  Menu,
  ChevronLeft,
  UserPlus,
  Settings2,
} from "lucide-react";
import logo from "../../assets/dashlogo.png";

const NAV_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "providers", label: "Providers", icon: Briefcase },
  { id: "users", label: "Users", icon: Users },
  { id: "contacts", label: "Contacts", icon: MessageCircle },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "reports", label: "Reports", icon: AlertCircle },
  { id: "admins", label: "Admins", icon: Shield, superAdminOnly: true },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [reports, setReports] = useState([]);
  const [admins, setAdmins] = useState([]);
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminRole, setAdminRole] = useState("");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "admin",
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
  const token = localStorage.getItem("adminAuthToken");

  const showMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 4000);
  };

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAdminRole(payload.role || "admin");
      } catch (e) {}
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
  }, []);
  useEffect(() => {
    if (activeView === "users") fetchUsers();
    if (activeView === "providers") fetchProviders();
    if (activeView === "contacts") fetchContacts();
    if (activeView === "activity") fetchActivity();
    if (activeView === "reports") fetchReports();
    if (activeView === "admins") fetchAdmins();
  }, [activeView, page, searchTerm, filterStatus]);
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeView]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDashboardData(data.data);
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        search: searchTerm,
        accountType: filterStatus !== "all" ? filterStatus : "",
      });
      const res = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search: searchTerm });
      if (filterStatus === "submitted")
        params.append("verificationStatus", "submitted");
      if (filterStatus === "approved")
        params.append("verificationStatus", "approved");
      if (filterStatus === "rejected")
        params.append("verificationStatus", "rejected");
      const res = await fetch(`${API_URL}/admin/providers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProviders(data.data);
        setTotalPages(data.pagination?.pages || 1);
      }
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/customer-contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/provider-activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setActivityData(data.data);
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAdmins(data.data);
    } catch (err) {
      showMessage(setError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveProvider = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/providers/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        showMessage(setSuccess, "Provider approved!");
        fetchProviders();
        fetchDashboard();
      } else showMessage(setError, data.message);
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const rejectProvider = async () => {
    if (!rejectReason.trim())
      return showMessage(setError, "Please provide a reason");
    try {
      const res = await fetch(
        `${API_URL}/admin/providers/${selectedProvider}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: rejectReason }),
        },
      );
      const data = await res.json();
      if (data.success) {
        showMessage(setSuccess, "Provider rejected");
        setShowRejectModal(false);
        setRejectReason("");
        fetchProviders();
        fetchDashboard();
      } else showMessage(setError, data.message);
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showMessage(setSuccess, data.message);
        fetchUsers();
      }
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        showMessage(setSuccess, "User deleted");
        fetchUsers();
        fetchDashboard();
      }
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const resolveReport = async (id) => {
    try {
      await fetch(`${API_URL}/admin/reports/${id}/resolve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage(setSuccess, "Report resolved");
      fetchReports();
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const createAdmin = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(setSuccess, "Admin created");
        setShowAddAdmin(false);
        setNewAdmin({ email: "", password: "", fullName: "", role: "admin" });
        fetchAdmins();
      } else showMessage(setError, data.message);
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const deleteAdmin = async (id) => {
    if (!confirm("Delete this admin?")) return;
    try {
      await fetch(`${API_URL}/admin/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage(setSuccess, "Admin deleted");
      fetchAdmins();
    } catch (err) {
      showMessage(setError, err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    window.location.href = "/admin/login";
  };

  const viewProviderDetails = (provider) => {
    setSelectedProvider(provider);
  };

  const getStatusBadge = (status) => {
    const styles = {
      submitted: "bg-yellow-100 text-yellow-700",
      under_review: "bg-blue-100 text-blue-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-600",
    };
    return styles[status] || styles.pending;
  };

  const isSuperAdmin = adminRole === "super_admin";

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-[260px] bg-[#1E2420] text-white flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8" />
            <span className="text-[14px] font-semibold font-['Space_Grotesk',sans-serif]">
              9jaTradiesPages
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_CONFIG.filter(
            (item) => !item.superAdminOnly || isSuperAdmin,
          ).map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setPage(1);
                  setSearchTerm("");
                  setFilterStatus("all");
                  setSelectedProvider(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all ${isActive ? "bg-[#F0821E] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon className="h-4 w-4" /> {item.label}
                {item.id === "providers" &&
                  dashboardData?.stats?.pendingVerifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {dashboardData.stats.pendingVerifications}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-[11px] text-white/40 mb-2 px-4">
            {adminRole === "super_admin" ? "Super Admin" : "Admin"}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] text-white/60 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto w-full">
        <div className="bg-white border-b border-[#E2E0D9] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#55605A]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-[16px] md:text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">
              {NAV_CONFIG.find((n) => n.id === activeView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-[#E2E0D9] text-[13px] w-[180px] md:w-[250px] focus:outline-none focus:border-[#1E7A34]"
              />
            </div>
            <div className="h-9 w-9 rounded-full bg-[#F0821E] flex items-center justify-center text-white text-[13px] font-semibold">
              A
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{error}</span>
              <button onClick={() => setError("")} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-[13px] text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{success}</span>
              <button onClick={() => setSuccess("")} className="ml-auto">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={dashboardData?.stats?.totalUsers || 0}
                  color="blue"
                />
                <StatCard
                  icon={Briefcase}
                  label="Providers"
                  value={dashboardData?.stats?.totalProviders || 0}
                  color="green"
                />
                <StatCard
                  icon={Clock}
                  label="Pending"
                  value={dashboardData?.stats?.pendingVerifications || 0}
                  color="orange"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Verified"
                  value={dashboardData?.stats?.verifiedProviders || 0}
                  color="purple"
                />
              </div>
              {(dashboardData?.stats?.pendingVerifications || 0) > 0 && (
                <div className="mb-6 md:mb-8 bg-[#FFF8F0] border border-[#F0821E]/20 rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#F0821E] flex-shrink-0" />
                    <div>
                      <p className="text-[13px] md:text-[14px] font-semibold">
                        {dashboardData.stats.pendingVerifications} providers
                        waiting
                      </p>
                      <p className="text-[11px] md:text-[12px] text-[#55605A]">
                        Review in Providers tab
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView("providers");
                      setFilterStatus("submitted");
                    }}
                    className="rounded-lg bg-[#F0821E] px-4 py-2 text-[12px] md:text-[13px] font-semibold text-white hover:bg-[#D5720F] whitespace-nowrap"
                  >
                    Review Now
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] md:text-[15px] font-semibold">
                      Recent Users
                    </h3>
                    <button
                      onClick={() => setActiveView("users")}
                      className="text-[11px] md:text-[12px] text-[#1E7A34] hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {(dashboardData?.recentUsers || [])
                      .slice(0, 5)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-[#F7F6F2]"
                        >
                          <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[11px] md:text-[12px] font-semibold flex-shrink-0">
                            {user.fullName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] md:text-[13px] font-semibold truncate">
                              {user.fullName}
                            </p>
                            <p className="text-[10px] md:text-[11px] text-[#9A9488] truncate">
                              {user.email}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-semibold whitespace-nowrap ${user.accountType === "provider" ? "bg-[#F0821E]/10 text-[#F0821E]" : "bg-[#1E7A34]/10 text-[#1E7A34]"}`}
                          >
                            {user.accountType}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] md:text-[15px] font-semibold">
                      Recent Providers
                    </h3>
                    <button
                      onClick={() => setActiveView("providers")}
                      className="text-[11px] md:text-[12px] text-[#1E7A34] hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {(dashboardData?.recentProviders || [])
                      .slice(0, 5)
                      .map((provider) => (
                        <div
                          key={provider.id}
                          className="flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-[#F7F6F2]"
                        >
                          <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[11px] md:text-[12px] font-semibold text-[#F0821E] flex-shrink-0">
                            {provider.companyName?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] md:text-[13px] font-semibold truncate">
                              {provider.companyName}
                            </p>
                            <p className="text-[10px] md:text-[11px] text-[#9A9488] truncate">
                              {provider.serviceType} · {provider.city},{" "}
                              {provider.state}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-semibold whitespace-nowrap ${getStatusBadge(provider.verificationStatus)}`}
                          >
                            {provider.verificationStatus || "pending"}
                          </span>
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
                {["all", "submitted", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setPage(1);
                    }}
                    className={`px-3 md:px-4 py-2 rounded-lg text-[12px] md:text-[13px] font-medium whitespace-nowrap ${filterStatus === status ? "bg-[#1E2420] text-white" : "bg-white border border-[#E2E0D9] text-[#55605A] hover:bg-[#F7F6F2]"}`}
                  >
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                    {status === "submitted" &&
                      dashboardData?.stats?.pendingVerifications > 0 && (
                        <span className="ml-1.5 bg-[#F0821E] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {dashboardData.stats.pendingVerifications}
                        </span>
                      )}
                  </button>
                ))}
              </div>
              {selectedProvider ? (
                <div>
                  <button
                    onClick={() => setSelectedProvider(null)}
                    className="flex items-center gap-2 text-[13px] text-[#55605A] hover:text-[#1E2420] mb-4"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to list
                  </button>
                  <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-[#F0821E]/10 flex items-center justify-center text-[20px] md:text-[24px] font-bold text-[#F0821E] flex-shrink-0">
                          {selectedProvider.companyName?.[0]}
                        </div>
                        <div>
                          <h3 className="text-[16px] md:text-[18px] font-semibold">
                            {selectedProvider.companyName}
                          </h3>
                          <p className="text-[12px] md:text-[13px] text-[#55605A]">
                            {selectedProvider.user?.fullName}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(selectedProvider.verificationStatus)}`}
                          >
                            {selectedProvider.verificationStatus}
                          </span>
                        </div>
                      </div>
                      {selectedProvider.verificationStatus === "submitted" && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() =>
                              approveProvider(selectedProvider._id)
                            }
                            className="flex-1 sm:flex-none rounded-lg bg-[#1E7A34] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#166B2C] flex items-center justify-center gap-1"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectModal(true);
                            }}
                            className="flex-1 sm:flex-none rounded-lg border border-red-300 px-4 py-2 text-[12px] font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1"
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <DetailSection title="Contact Info">
                        <DetailItem
                          icon={Mail}
                          label="Email"
                          value={selectedProvider.user?.email}
                        />
                        <DetailItem
                          icon={Phone}
                          label="Phone"
                          value={selectedProvider.user?.phone || "N/A"}
                        />
                        <DetailItem
                          icon={MapPin}
                          label="Location"
                          value={`${selectedProvider.city || ""}, ${selectedProvider.state || ""}`}
                        />
                      </DetailSection>
                      <DetailSection title="Business Info">
                        <DetailItem
                          icon={Briefcase}
                          label="Service"
                          value={selectedProvider.serviceType}
                        />
                        <DetailItem
                          icon={Star}
                          label="Rating"
                          value={selectedProvider.rating || "0"}
                        />
                        <DetailItem
                          icon={Activity}
                          label="Jobs"
                          value={selectedProvider.completedJobs || "0"}
                        />
                      </DetailSection>
                      <DetailSection title="Documents">
                        {selectedProvider.verificationDocuments?.map(
                          (doc, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {doc.type === "nin" ? (
                                <FileText className="h-4 w-4 text-[#55605A]" />
                              ) : (
                                <Image className="h-4 w-4 text-[#55605A]" />
                              )}
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] text-[#1E7A34] hover:underline"
                              >
                                View {doc.type === "nin" ? "NIN" : "Selfie"}
                              </a>
                            </div>
                          ),
                        ) || (
                          <p className="text-[13px] text-[#9A9488]">
                            No documents
                          </p>
                        )}
                      </DetailSection>
                      <DetailSection title="NIN">
                        <DetailItem
                          icon={FileText}
                          label="NIN Number"
                          value={selectedProvider.nin?.number || "N/A"}
                        />
                      </DetailSection>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F7F6F2]">
                        <tr>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                            Provider
                          </th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                            Service
                          </th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                            Location
                          </th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                            Status
                          </th>
                          <th className="text-right px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12">
                              Loading...
                            </td>
                          </tr>
                        ) : providers.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-12">
                              No providers
                            </td>
                          </tr>
                        ) : (
                          providers.map((p) => (
                            <tr
                              key={p._id}
                              className="border-t hover:bg-[#F7F6F2]"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[11px] font-semibold text-[#F0821E]">
                                    {p.companyName?.[0]}
                                  </div>
                                  <div>
                                    <p className="text-[13px] font-medium">
                                      {p.companyName}
                                    </p>
                                    <p className="text-[11px] text-[#9A9488]">
                                      {p.user?.fullName}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[13px]">
                                {p.serviceType}
                              </td>
                              <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                                {p.city}, {p.state}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(p.verificationStatus)}`}
                                >
                                  {p.verificationStatus || "pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => viewProviderDetails(p)}
                                    className="p-1.5 rounded-lg hover:bg-[#EFEDE6]"
                                  >
                                    <Eye className="h-4 w-4 text-[#55605A]" />
                                  </button>
                                  {p.verificationStatus === "submitted" && (
                                    <button
                                      onClick={() => approveProvider(p._id)}
                                      className="p-1.5 rounded-lg hover:bg-green-50"
                                    >
                                      <Check className="h-4 w-4 text-green-600" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden space-y-3 p-3">
                    {loading ? (
                      <p className="text-center py-12">Loading...</p>
                    ) : providers.length === 0 ? (
                      <p className="text-center py-12">No providers</p>
                    ) : (
                      providers.map((p) => (
                        <div
                          key={p._id}
                          className="bg-white rounded-xl border p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[14px] font-semibold text-[#F0821E]">
                                {p.companyName?.[0]}
                              </div>
                              <div>
                                <p className="text-[14px] font-semibold">
                                  {p.companyName}
                                </p>
                                <p className="text-[11px] text-[#9A9488]">
                                  {p.user?.fullName}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadge(p.verificationStatus)}`}
                            >
                              {p.verificationStatus || "pending"}
                            </span>
                          </div>
                          <div className="text-[12px] text-[#55605A]">
                            <p>{p.serviceType}</p>
                            <p>
                              {p.city}, {p.state}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                            <button
                              onClick={() => viewProviderDetails(p)}
                              className="flex-1 py-2 rounded-lg border text-[12px] font-medium hover:bg-[#F7F6F2]"
                            >
                              View
                            </button>
                            {p.verificationStatus === "submitted" && (
                              <button
                                onClick={() => approveProvider(p._id)}
                                className="flex-1 py-2 rounded-lg bg-[#1E7A34] text-white text-[12px] font-medium"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users View */}
          {activeView === "users" && (
            <div>
              <div className="flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
                {["all", "customer", "provider"].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterStatus(type);
                      setPage(1);
                    }}
                    className={`px-3 md:px-4 py-2 rounded-lg text-[12px] md:text-[13px] font-medium whitespace-nowrap ${filterStatus === type ? "bg-[#1E2420] text-white" : "bg-white border border-[#E2E0D9] text-[#55605A] hover:bg-[#F7F6F2]"}`}
                  >
                    {type === "all"
                      ? "All Users"
                      : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          User
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Email
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Type
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Status
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Joined
                        </th>
                        <th className="text-right px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-12">
                            Loading...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-12">
                            No users
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr
                            key={u._id}
                            className="border-t hover:bg-[#F7F6F2]"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[11px] font-semibold">
                                  {u.fullName?.[0]}
                                </div>
                                <span className="text-[13px] font-medium">
                                  {u.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px] text-[#55605A]">
                              {u.email}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.accountType === "provider" ? "bg-[#F0821E]/10 text-[#F0821E]" : "bg-[#1E7A34]/10 text-[#1E7A34]"}`}
                              >
                                {u.accountType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                              >
                                {u.isActive ? "Active" : "Disabled"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => toggleUserStatus(u._id)}
                                  className="p-1.5 rounded-lg hover:bg-[#EFEDE6]"
                                >
                                  <Ban className="h-4 w-4 text-[#55605A]" />
                                </button>
                                <button
                                  onClick={() => deleteUser(u._id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3 p-3">
                  {loading ? (
                    <p className="text-center py-12">Loading...</p>
                  ) : users.length === 0 ? (
                    <p className="text-center py-12">No users</p>
                  ) : (
                    users.map((u) => (
                      <div
                        key={u._id}
                        className="bg-white rounded-xl border p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[14px] font-semibold">
                              {u.fullName?.[0]}
                            </div>
                            <div>
                              <p className="text-[14px] font-semibold">
                                {u.fullName}
                              </p>
                              <p className="text-[11px] text-[#9A9488]">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            {u.isActive ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#55605A]">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.accountType === "provider" ? "bg-[#F0821E]/10 text-[#F0821E]" : "bg-[#1E7A34]/10 text-[#1E7A34]"}`}
                          >
                            {u.accountType}
                          </span>
                          <span className="ml-2">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                          <button
                            onClick={() => toggleUserStatus(u._id)}
                            className="flex-1 py-2 rounded-lg border text-[12px] font-medium hover:bg-[#F7F6F2]"
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="py-2 px-4 rounded-lg border border-red-200 text-[12px] font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contacts View */}
          {activeView === "contacts" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6 font-['Space_Grotesk',sans-serif]">
                Customer-Provider Contacts
              </h2>
              <div className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Customer
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Provider
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Service
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Last Contact
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Messages
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-12">
                            Loading...
                          </td>
                        </tr>
                      ) : contacts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-12">
                            No contacts
                          </td>
                        </tr>
                      ) : (
                        contacts.map((c) => (
                          <tr
                            key={c.id}
                            className="border-t hover:bg-[#F7F6F2]"
                          >
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">
                                {c.customerName}
                              </p>
                              <p className="text-[11px] text-[#9A9488]">
                                {c.customerEmail}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">
                                {c.providerName}
                              </p>
                              <p className="text-[11px] text-[#9A9488]">
                                {c.providerCompany}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-[13px]">
                              {c.serviceType}
                            </td>
                            <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                              {new Date(c.lastContact).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-[13px]">
                              {c.messageCount}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3 p-3">
                  {loading ? (
                    <p className="text-center py-12">Loading...</p>
                  ) : contacts.length === 0 ? (
                    <p className="text-center py-12">No contacts</p>
                  ) : (
                    contacts.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-xl border p-4"
                      >
                        <p className="text-[13px] font-semibold">
                          {c.customerName} → {c.providerName}
                        </p>
                        <p className="text-[11px] text-[#9A9488]">
                          {c.serviceType} · {c.messageCount} messages
                        </p>
                        <p className="text-[11px] text-[#9A9488]">
                          Last: {new Date(c.lastContact).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Activity View */}
          {activeView === "activity" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6 font-['Space_Grotesk',sans-serif]">
                Provider Activity
              </h2>
              <div className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Provider
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Service
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Status
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Last Active
                        </th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#55605A]">
                          Available
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="text-center py-12">
                            Loading...
                          </td>
                        </tr>
                      ) : activityData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-12">
                            No data
                          </td>
                        </tr>
                      ) : (
                        activityData.map((p) => (
                          <tr
                            key={p.id}
                            className="border-t hover:bg-[#F7F6F2]"
                          >
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">
                                {p.companyName}
                              </p>
                              <p className="text-[11px] text-[#9A9488]">
                                {p.fullName}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-[13px]">
                              {p.serviceType}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.verificationStatus === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                              >
                                {p.verificationStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                              {p.lastActive
                                ? new Date(p.lastActive).toLocaleDateString()
                                : "Never"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                              >
                                {p.isAvailable ? "Yes" : "No"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3 p-3">
                  {loading ? (
                    <p className="text-center py-12">Loading...</p>
                  ) : activityData.length === 0 ? (
                    <p className="text-center py-12">No data</p>
                  ) : (
                    activityData.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl border p-4"
                      >
                        <p className="text-[13px] font-semibold">
                          {p.companyName}
                        </p>
                        <p className="text-[11px] text-[#9A9488]">
                          {p.serviceType} · {p.verificationStatus}
                        </p>
                        <p className="text-[11px] text-[#9A9488]">
                          Last active:{" "}
                          {p.lastActive
                            ? new Date(p.lastActive).toLocaleDateString()
                            : "Never"}{" "}
                          · {p.isAvailable ? "Available" : "Unavailable"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reports View */}
          {activeView === "reports" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6 font-['Space_Grotesk',sans-serif]">
                Reports & Complaints
              </h2>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center py-12 text-[#9A9488]">Loading...</p>
                ) : reports.length === 0 ? (
                  <p className="text-center py-12 text-[#9A9488]">No reports</p>
                ) : (
                  reports.map((r) => (
                    <div
                      key={r._id}
                      className="bg-white rounded-xl border border-[#E2E0D9] p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-semibold">{r.text}</p>
                          <p className="text-[12px] text-[#9A9488] mt-1">
                            From: {r.user?.fullName} ({r.user?.email})
                          </p>
                          <p className="text-[11px] text-[#9A9488]">
                            {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {r.kind === "report" && (
                          <button
                            onClick={() => resolveReport(r._id)}
                            className="px-3 py-1.5 rounded-lg bg-[#1E7A34] text-white text-[12px] font-semibold hover:bg-[#166B2C]"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Admins View (Super Admin Only) */}
          {activeView === "admins" && isSuperAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold font-['Space_Grotesk',sans-serif]">
                  Admin Management
                </h2>
                <button
                  onClick={() => setShowAddAdmin(true)}
                  className="rounded-lg bg-[#1E7A34] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#166B2C] flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </button>
              </div>
              <div className="bg-white rounded-xl border border-[#E2E0D9] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F7F6F2]">
                    <tr>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">
                        Email
                      </th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">
                        Role
                      </th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">
                        Last Login
                      </th>
                      <th className="text-right px-6 py-3 text-[12px] font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a) => (
                      <tr key={a._id} className="border-t hover:bg-[#F7F6F2]">
                        <td className="px-6 py-4 text-[13px] font-medium">
                          {a.fullName}
                        </td>
                        <td className="px-6 py-4 text-[13px] text-[#55605A]">
                          {a.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold ${a.role === "super_admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {a.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                          {a.lastLogin
                            ? new Date(a.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {a.role !== "super_admin" && (
                            <button
                              onClick={() => deleteAdmin(a._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeView === "settings" && (
            <div className="bg-white rounded-xl border border-[#E2E0D9] p-4 md:p-6 max-w-2xl">
              <h3 className="text-[16px] md:text-[18px] font-semibold mb-4 md:mb-6 font-['Space_Grotesk',sans-serif]">
                Settings
              </h3>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[12px] md:text-[13px] font-semibold mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    defaultValue="9jaTradiesPages"
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[13px] md:text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] md:text-[13px] font-semibold mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    defaultValue="support@9jatradiespages.com"
                    className="w-full rounded-lg border border-[#E2E0D9] px-4 py-2.5 text-[13px] md:text-[14px]"
                  />
                </div>
                <button className="rounded-lg bg-[#1E7A34] px-6 py-2.5 text-[13px] md:text-[14px] font-semibold text-white hover:bg-[#166B2C]">
                  Save
                </button>
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
            <p className="text-[13px] text-[#55605A] mb-4">
              Provide a reason for rejection.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g., NIN document is unclear..."
              className="w-full rounded-lg border border-[#E2E0D9] px-4 py-3 text-[14px] resize-none focus:outline-none focus:border-red-300"
            />
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg border text-[13px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={rejectProvider}
                className="px-4 py-2 rounded-lg bg-red-600 text-[13px] font-semibold text-white hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-[16px] font-semibold mb-4">Add Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAdmin.fullName}
                  onChange={(e) =>
                    setNewAdmin((p) => ({ ...p, fullName: e.target.value }))
                  }
                  className="w-full rounded-lg border px-4 py-2.5 text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full rounded-lg border px-4 py-2.5 text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full rounded-lg border px-4 py-2.5 text-[14px]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-2">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin((p) => ({ ...p, role: e.target.value }))
                  }
                  className="w-full rounded-lg border px-4 py-2.5 text-[14px]"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button
                onClick={() => setShowAddAdmin(false)}
                className="px-4 py-2 rounded-lg border text-[13px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={createAdmin}
                className="px-4 py-2 rounded-lg bg-[#1E7A34] text-[13px] font-semibold text-white hover:bg-[#166B2C]"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    orange: "bg-orange-50 border-orange-200",
    purple: "bg-purple-50 border-purple-200",
  };
  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };
  return (
    <div
      className={`rounded-xl border p-3 md:p-6 ${colors[color] || colors.green}`}
    >
      <Icon
        className={`h-5 w-5 md:h-6 md:w-6 ${iconColors[color] || iconColors.green} mb-2 md:mb-3`}
      />
      <p className="text-[22px] md:text-[28px] font-bold font-['Space_Grotesk',sans-serif]">
        {value}
      </p>
      <p className="text-[11px] md:text-[13px] text-[#55605A] mt-1">{label}</p>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div className="space-y-2 md:space-y-3">
      <h4 className="text-[11px] md:text-[12px] font-semibold uppercase text-[#9A9488]">
        {title}
      </h4>
      <div className="space-y-1.5 md:space-y-2">{children}</div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#9A9488]" />
      <span className="text-[11px] md:text-[12px] text-[#9A9488]">
        {label}:
      </span>
      <span className="text-[12px] md:text-[13px] font-medium break-all">
        {value}
      </span>
    </div>
  );
}
