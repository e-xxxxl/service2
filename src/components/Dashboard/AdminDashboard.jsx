// components/dashboard/AdminDashboard.jsx - COMPLETE WITH ALL TABS AND EDIT FUNCTIONALITY
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Briefcase, CheckCircle, Clock,
  Search, Shield, Ban, Trash2, LogOut, X, AlertCircle,
  Eye, Check, ChevronRight, RefreshCw, Mail, Phone, MapPin,
  Star, Image, FileText, Activity, MessageCircle, Menu,
  ChevronLeft, UserPlus, Settings2, Download, Calculator,
  CreditCard, Edit3, Save
} from "lucide-react";
import logo from "../../assets/dashlogo.png";

const NAV_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "providers", label: "Providers", icon: Briefcase },
  { id: "users", label: "Users", icon: Users },
  { id: "quotes", label: "Quotes", icon: Calculator },
  { id: "contacts", label: "Contacts", icon: MessageCircle },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "reports", label: "Reports", icon: AlertCircle },
  { id: "admins", label: "Admins", icon: Shield, superAdminOnly: true },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState(
    () => sessionStorage.getItem("adminActiveView") || "dashboard"
  );
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [quotes, setQuotes] = useState([]);
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
    email: "", password: "", fullName: "", role: "admin"
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Editing states
  const [editingUser, setEditingUser] = useState(null);
  const [editingProvider, setEditingProvider] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(""); // 'user' or 'provider'

  const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
  const token = localStorage.getItem("adminAuthToken");

  useEffect(() => {
    sessionStorage.setItem("adminActiveView", activeView);
  }, [activeView]);

  const showMessage = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(""), 4000);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setAdminRole(decoded.role || "admin");
      } catch (e) {}
    }
  }, [token]);

  useEffect(() => { fetchDashboard(); }, []);
  
  useEffect(() => {
    if (activeView === "users") fetchUsers();
    if (activeView === "providers") fetchProviders();
    if (activeView === "quotes") fetchQuotes();
    if (activeView === "contacts") fetchContacts();
    if (activeView === "activity") fetchActivity();
    if (activeView === "reports") fetchReports();
    if (activeView === "admins") fetchAdmins();
  }, [activeView, page, searchTerm, filterStatus]);

  useEffect(() => { setSidebarOpen(false); }, [activeView]);

  // ==================== FETCH FUNCTIONS ====================
  
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) setDashboardData(d.data);
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, search: searchTerm });
      if (filterStatus !== "all") p.append("accountType", filterStatus);
      const r = await fetch(`${API_URL}/admin/users?${p}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) {
        setUsers(d.data);
        setTotalPages(d.pagination?.pages || 1);
      }
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, search: searchTerm });
      if (filterStatus !== "all") p.append("verificationStatus", filterStatus);
      const r = await fetch(`${API_URL}/admin/providers?${p}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) {
        setProviders(d.data);
        setTotalPages(d.pagination?.pages || 1);
      }
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/quotes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) setQuotes(d.data);
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/customer-contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) setContacts(d.data);
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/provider-activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) setActivityData(d.data);
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) setReports(d.data);
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) setAdmins(d.data);
    } catch (e) {
      showMessage(setError, e.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== EDIT FUNCTIONS ====================
  
  const openEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      accountType: user.accountType || "customer",
      isActive: user.isActive !== false
    });
    setEditType("user");
    setShowEditModal(true);
  };

  const openEditProvider = (provider) => {
    setEditingProvider(provider);
    setEditForm({
      companyName: provider.companyName || "",
      serviceType: provider.serviceType || "",
      city: provider.city || "",
      state: provider.state || "",
      businessDescription: provider.businessDescription || "",
      verificationStatus: provider.verificationStatus || "pending",
      isVisible: provider.isVisible !== false,
      isAvailable: provider.isAvailable !== false,
      phone: provider.user?.phone || "",
      email: provider.user?.email || "",
      fullName: provider.user?.fullName || "",
      yearsOfExperience: provider.yearsOfExperience || 0,
      teamSize: provider.teamSize || 1,
      completedJobs: provider.completedJobs || 0,
      rating: provider.rating || 0
    });
    setEditType("provider");
    setShowEditModal(true);
  };

  const saveUserEdit = async () => {
    if (!editingUser) return;
    try {
      const r = await fetch(`${API_URL}/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      const d = await r.json();
      if (d.success) {
        showMessage(setSuccess, "User updated successfully");
        setShowEditModal(false);
        fetchUsers();
        fetchDashboard();
      } else {
        showMessage(setError, d.message || "Failed to update user");
      }
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  const saveProviderEdit = async () => {
    if (!editingProvider) return;
    try {
      const r = await fetch(`${API_URL}/admin/providers/${editingProvider._id}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      const d = await r.json();
      if (d.success) {
        showMessage(setSuccess, "Provider updated successfully");
        setShowEditModal(false);
        fetchProviders();
        fetchDashboard();
      } else {
        showMessage(setError, d.message || "Failed to update provider");
      }
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  // ==================== ACTION FUNCTIONS ====================
  
  const approveProvider = async (id) => {
    try {
      const r = await fetch(`${API_URL}/admin/providers/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const d = await r.json();
      if (d.success) {
        showMessage(setSuccess, "✅ Approved!");
        setProviders((p) =>
          p.map((x) =>
            x._id === id
              ? { ...x, verificationStatus: "approved", isVisible: true }
              : x
          )
        );
        if (selectedProvider?._id === id) {
          setSelectedProvider((p) => ({
            ...p, verificationStatus: "approved", isVisible: true
          }));
        }
        fetchDashboard();
      } else showMessage(setError, d.message);
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

// components/dashboard/AdminDashboard.jsx - FIXED rejectProvider function

const rejectProvider = async () => {
    if (!rejectReason.trim()) return showMessage(setError, "Provide a reason");
    try {
      // ✅ FIXED: Get the correct ID whether selectedProvider is an object or string
      const providerId = typeof selectedProvider === 'object' 
        ? selectedProvider._id 
        : selectedProvider;
      
      if (!providerId) {
        return showMessage(setError, "Invalid provider ID");
      }
      
      const r = await fetch(
        `${API_URL}/admin/providers/${providerId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reason: rejectReason })
        }
      );
      const d = await r.json();
      if (d.success) {
        showMessage(setSuccess, "Rejected");
        setShowRejectModal(false);
        setRejectReason("");
        // Update providers list
        setProviders((p) =>
          p.map((x) =>
            x._id === providerId
              ? { ...x, verificationStatus: "rejected", isVisible: false }
              : x
          )
        );
        // Clear selected provider if viewing details
        setSelectedProvider(null);
        fetchDashboard();
      } else {
        showMessage(setError, d.message || "Failed to reject provider");
      }
    } catch (e) {
      showMessage(setError, e.message);
    }
  };
  const toggleUserStatus = async (id) => {
    try {
      const r = await fetch(`${API_URL}/admin/users/${id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) {
        showMessage(setSuccess, d.message);
        fetchUsers();
      }
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage(setSuccess, "User deleted");
      fetchUsers();
      fetchDashboard();
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  const resolveReport = async (id) => {
    try {
      await fetch(`${API_URL}/admin/reports/${id}/resolve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage(setSuccess, "Resolved");
      fetchReports();
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  const createAdmin = async () => {
    try {
      const r = await fetch(`${API_URL}/admin/admins`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAdmin)
      });
      const d = await r.json();
      if (d.success) {
        showMessage(setSuccess, "Admin created");
        setShowAddAdmin(false);
        setNewAdmin({ email: "", password: "", fullName: "", role: "admin" });
        fetchAdmins();
      } else showMessage(setError, d.message);
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  const deleteAdmin = async (id) => {
    if (!confirm("Delete this admin?")) return;
    try {
      await fetch(`${API_URL}/admin/admins/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage(setSuccess, "Admin deleted");
      fetchAdmins();
    } catch (e) {
      showMessage(setError, e.message);
    }
  };

  const exportCSV = async (type) => {
    try {
      showMessage(setSuccess, "Downloading...");
      const r = await fetch(`${API_URL}/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!r.ok) throw new Error("Export failed");
      const txt = await r.text();
      const blob = new Blob(["\uFEFF" + txt], {
        type: "text/csv;charset=utf-8;"
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showMessage(setSuccess, "Downloaded!");
    } catch (e) {
      showMessage(setError, "Export failed");
    }
  };

  const viewUserDetails = (u) => {
    setSelectedUser(u);
    setShowUserModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    window.location.href = "/admin/login";
  };

  const viewProviderDetails = (p) => {
    setSelectedProvider(p);
  };

  // ==================== HELPER FUNCTIONS ====================
  
  const gsb = (s) => {
    const st = {
      submitted: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      pending: "bg-gray-100 text-gray-600"
    };
    return st[s] || st.pending;
  };

  const gqs = (s) => {
    const st = {
      active: "bg-green-100 text-green-700",
      pending_payment: "bg-[#FFF8F0] text-[#B85E10]",
      quote_sent: "bg-yellow-100 text-yellow-700",
      quote_accepted: "bg-blue-100 text-blue-700",
      in_progress: "bg-blue-100 text-blue-700",
      disputed: "bg-red-100 text-red-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-purple-100 text-purple-700"
    };
    return st[s] || "bg-gray-100 text-gray-600";
  };

  const fp = (p) => {
    if (!p || p === "N/A") return "N/A";
    const c = p.replace(/\D/g, "");
    if (c.length === 11) return c.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    return p;
  };

  const isSuperAdmin = adminRole === "super_admin";

  // ==================== STAT CARD COMPONENT ====================
  
  const StatCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      orange: "bg-orange-50 border-orange-200",
      purple: "bg-purple-50 border-purple-200"
    };
    const icons = {
      blue: "text-blue-600",
      green: "text-green-600",
      orange: "text-orange-600",
      purple: "text-purple-600"
    };
    return (
      <div className={`rounded-xl border p-3 md:p-6 ${colors[color] || colors.green}`}>
        <Icon className={`h-5 w-5 md:h-6 md:w-6 ${icons[color] || icons.green} mb-2 md:mb-3`} />
        <p className="text-[22px] md:text-[28px] font-bold">{value}</p>
        <p className="text-[11px] md:text-[13px] text-[#55605A] mt-1">{label}</p>
      </div>
    );
  };

  // ==================== PAGINATION COMPONENT ====================
  
  const Pagination = () => (
    <div className="flex items-center justify-between mt-4 px-6 pb-4">
      <p className="text-[12px] text-[#9A9488]">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg border text-[12px] disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg border text-[12px] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  // ==================== RENDER ====================
  
  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-[260px] bg-[#1E2420] text-white flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8" />
            <span className="text-[14px] font-semibold">9jaTradiesPages</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_CONFIG.filter((i) => !i.superAdminOnly || isSuperAdmin).map(
            (i) => {
              const Icon = i.icon;
              const isActive = activeView === i.id;
              return (
                <button
                  key={i.id}
                  onClick={() => {
                    setActiveView(i.id);
                    setPage(1);
                    setSearchTerm("");
                    setFilterStatus("all");
                    setSelectedProvider(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all ${isActive ? "bg-[#F0821E] text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" /> {i.label}
                  {i.id === "providers" &&
                    dashboardData?.stats?.pendingVerifications > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {dashboardData.stats.pendingVerifications}
                      </span>
                    )}
                </button>
              );
            }
          )}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto w-full">
        {/* TOP BAR */}
        <div className="bg-white border-b border-[#E2E0D9] px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-[#55605A]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-[16px] md:text-[18px] font-semibold">
              {NAV_CONFIG.find((n) => n.id === activeView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9488]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border text-[13px] w-[180px] md:w-[250px] focus:outline-none focus:border-[#1E7A34]"
              />
            </div>
            <div className="h-9 w-9 rounded-full bg-[#F0821E] flex items-center justify-center text-white text-[13px] font-semibold">
              A
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-4 md:p-8">
          {/* ERROR & SUCCESS MESSAGES */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-[13px] text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{error}</span>
              <button onClick={() => setError("")} className="ml-auto"><X className="h-4 w-4" /></button>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-[13px] text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{success}</span>
              <button onClick={() => setSuccess("")} className="ml-auto"><X className="h-4 w-4" /></button>
            </div>
          )}

          {/* ==================== DASHBOARD VIEW ==================== */}
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 mb-6 md:mb-8">
                <StatCard icon={Users} label="Total Users" value={dashboardData?.stats?.totalUsers || 0} color="blue" />
                <StatCard icon={Users} label="Customers" value={dashboardData?.stats?.totalCustomers || 0} color="green" />
                <StatCard icon={Briefcase} label="Providers" value={dashboardData?.stats?.totalProviders || 0} color="green" />
                <StatCard icon={Clock} label="Pending" value={dashboardData?.stats?.pendingVerifications || 0} color="orange" />
                <StatCard icon={CheckCircle} label="Verified" value={dashboardData?.stats?.verifiedProviders || 0} color="purple" />
              </div>
              {(dashboardData?.stats?.pendingVerifications || 0) > 0 && (
                <div className="mb-6 bg-[#FFF8F0] border border-[#F0821E]/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#F0821E]" />
                    <p className="text-[13px] font-semibold">{dashboardData.stats.pendingVerifications} waiting</p>
                  </div>
                  <button onClick={() => { setActiveView("providers"); setFilterStatus("submitted"); }} className="rounded-lg bg-[#F0821E] px-4 py-2 text-[12px] font-semibold text-white">
                    Review Now
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-semibold">Recent Users</h3>
                    <button onClick={() => setActiveView("users")} className="text-[11px] text-[#1E7A34] hover:underline">View all</button>
                  </div>
                  <div className="space-y-2">
                    {(dashboardData?.recentUsers || []).slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F6F2]">
                        <div className="h-8 w-8 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[11px] font-semibold">{u.fullName?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold truncate">{u.fullName}</p>
                          <p className="text-[10px] text-[#9A9488] truncate">{u.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[14px] font-semibold">Recent Providers</h3>
                    <button onClick={() => setActiveView("providers")} className="text-[11px] text-[#1E7A34] hover:underline">View all</button>
                  </div>
                  <div className="space-y-2">
                    {(dashboardData?.recentProviders || []).slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F6F2]">
                        <div className="h-8 w-8 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[11px] font-semibold text-[#F0821E]">{p.companyName?.[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold truncate">{p.companyName}</p>
                          <p className="text-[10px] text-[#9A9488] truncate">{p.serviceType} · {p.city}, {p.state}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==================== USERS VIEW ==================== */}
          {activeView === "users" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  {["all", "customer", "provider"].map((t) => (
                    <button key={t} onClick={() => { setFilterStatus(t); setPage(1); }}
                      className={`px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${filterStatus === t ? "bg-[#1E2420] text-white" : "bg-white border text-[#55605A] hover:bg-[#F7F6F2]"}`}>
                      {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                    </button>
                  ))}
                </div>
                <button onClick={() => exportCSV("users")} className="px-3 py-2 rounded-lg border text-[12px] font-medium hover:bg-[#F7F6F2] flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">User</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Email</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Phone</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Type</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Status</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Joined</th>
                        <th className="text-right px-6 py-3 text-[12px] font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="7" className="text-center py-12">Loading...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan="7" className="text-center py-12">No users</td></tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u._id} className="border-t hover:bg-[#F7F6F2]">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[11px] font-semibold">{u.fullName?.[0]}</div>
                                <span className="text-[13px] font-medium">{u.fullName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[13px]">{u.email}</td>
                            <td className="px-6 py-4 text-[12px]">{fp(u.phone)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.accountType === "provider" ? "bg-[#F0821E]/10 text-[#F0821E]" : "bg-[#1E7A34]/10 text-[#1E7A34]"}`}>
                                {u.accountType}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {u.isActive ? "Active" : "Disabled"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isSuperAdmin && (
                                  <button onClick={() => openEditUser(u)} className="p-1.5 rounded-lg hover:bg-blue-50" title="Edit User">
                                    <Edit3 className="h-4 w-4 text-blue-500" />
                                  </button>
                                )}
                                <button onClick={() => viewUserDetails(u)} className="p-1.5 rounded-lg hover:bg-[#EFEDE6]">
                                  <Eye className="h-4 w-4 text-[#55605A]" />
                                </button>
                                <button onClick={() => toggleUserStatus(u._id)} className="p-1.5 rounded-lg hover:bg-[#EFEDE6]">
                                  <Ban className="h-4 w-4 text-[#55605A]" />
                                </button>
                                {isSuperAdmin && (
                                  <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg hover:bg-red-50">
                                    <Trash2 className="h-4 w-4 text-red-500" />
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
                {/* Mobile Users */}
                <div className="md:hidden space-y-3 p-3">
                  {loading ? (
                    <p className="text-center py-12">Loading...</p>
                  ) : users.length === 0 ? (
                    <p className="text-center py-12">No users</p>
                  ) : (
                    users.map((u) => (
                      <div key={u._id} className="bg-white rounded-xl border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#EFEDE6] flex items-center justify-center font-semibold">{u.fullName?.[0]}</div>
                            <div>
                              <p className="text-[14px] font-semibold">{u.fullName}</p>
                              <p className="text-[11px] text-[#9A9488]">{u.email}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${u.accountType === "provider" ? "bg-[#F0821E]/10 text-[#F0821E]" : "bg-[#1E7A34]/10 text-[#1E7A34]"}`}>
                            {u.accountType}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                          {isSuperAdmin && (
                            <button onClick={() => openEditUser(u)} className="flex-1 py-2 rounded-lg border text-[12px] font-medium text-blue-500">Edit</button>
                          )}
                          <button onClick={() => viewUserDetails(u)} className="flex-1 py-2 rounded-lg border text-[12px] font-medium">View</button>
                          <button onClick={() => toggleUserStatus(u._id)} className="flex-1 py-2 rounded-lg border text-[12px] font-medium">{u.isActive ? "Disable" : "Enable"}</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {totalPages > 1 && <Pagination />}
              </div>
            </div>
          )}

          {/* ==================== PROVIDERS VIEW ==================== */}
          {activeView === "providers" && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  {["all", "submitted", "approved", "rejected"].map((s) => (
                    <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
                      className={`px-3 py-2 rounded-lg text-[12px] font-medium whitespace-nowrap ${filterStatus === s ? "bg-[#1E2420] text-white" : "bg-white border text-[#55605A] hover:bg-[#F7F6F2]"}`}>
                      {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                      {s === "submitted" && dashboardData?.stats?.pendingVerifications > 0 && (
                        <span className="ml-1 bg-[#F0821E] text-white text-[10px] px-1.5 py-0.5 rounded-full">{dashboardData.stats.pendingVerifications}</span>
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={() => exportCSV("providers")} className="px-3 py-2 rounded-lg border text-[12px] font-medium hover:bg-[#F7F6F2] flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
              </div>
              
              {selectedProvider ? (
                <div>
                  <button onClick={() => setSelectedProvider(null)} className="flex items-center gap-2 text-[13px] hover:text-[#1E2420] mb-4">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <div className="bg-white rounded-xl border p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-[#F0821E]/10 flex items-center justify-center text-[20px] font-bold text-[#F0821E]">
                          {selectedProvider.companyName?.[0]}
                        </div>
                        <div>
                          <h3 className="text-[16px] md:text-[18px] font-semibold">{selectedProvider.companyName}</h3>
                          <p className="text-[12px] text-[#55605A]">{selectedProvider.user?.fullName || selectedProvider.fullName}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${gsb(selectedProvider.verificationStatus)}`}>
                            {selectedProvider.verificationStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSuperAdmin && (
                          <button onClick={() => openEditProvider(selectedProvider)} className="rounded-lg border border-blue-300 px-4 py-2 text-[12px] font-semibold text-blue-600 flex items-center gap-1">
                            <Edit3 className="h-4 w-4" /> Edit
                          </button>
                        )}
                        {selectedProvider.verificationStatus === "submitted" && (
                          <>
                            <button onClick={() => approveProvider(selectedProvider._id)} className="rounded-lg bg-[#1E7A34] px-4 py-2 text-[12px] font-semibold text-white flex items-center gap-1">
                              <Check className="h-4 w-4" /> Approve
                            </button>
                           // In the Provider detail view, update the reject button onClick:
<button 
  onClick={() => {
    // ✅ Store the ID consistently
    const providerId = selectedProvider._id || selectedProvider;
    setSelectedProvider(providerId);
    setShowRejectModal(true);
  }} 
  className="rounded-lg border border-red-300 px-4 py-2 text-[12px] font-semibold text-red-600 flex items-center gap-1"
>
  <X className="h-4 w-4" /> Reject
</button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-semibold uppercase text-[#9A9488]">Contact</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-[#9A9488]" />
                            <span className="text-[12px]">{selectedProvider.user?.email || selectedProvider.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-[#9A9488]" />
                            <span className="text-[12px]">{fp(selectedProvider.user?.phone || selectedProvider.phone)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-[#9A9488]" />
                            <span className="text-[12px]">{selectedProvider.city}, {selectedProvider.state}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-semibold uppercase text-[#9A9488]">Business</h4>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-[#9A9488]" />
                            <span className="text-[12px]">{selectedProvider.serviceType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-3.5 w-3.5 text-[#9A9488]" />
                            <span className="text-[12px]">{selectedProvider.rating || "0"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[12px] font-semibold uppercase text-[#9A9488]">Documents</h4>
                        {selectedProvider.verificationDocuments?.map((doc, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {doc.type === "nin" ? <FileText className="h-4 w-4 text-[#55605A]" /> : <Image className="h-4 w-4 text-[#55605A]" />}
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1E7A34] hover:underline">
                              View {doc.type === "nin" ? "NIN" : "Selfie"}
                            </a>
                          </div>
                        )) || <p className="text-[13px] text-[#9A9488]">No documents</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F7F6F2]">
                        <tr>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold">Provider</th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold">Service</th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold">Location</th>
                          <th className="text-left px-6 py-3 text-[12px] font-semibold">Status</th>
                          <th className="text-right px-6 py-3 text-[12px] font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="5" className="text-center py-12">Loading...</td></tr>
                        ) : providers.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-12">No providers</td></tr>
                        ) : (
                          providers.map((p) => (
                            <tr key={p._id} className="border-t hover:bg-[#F7F6F2]">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-[#F0821E]/10 flex items-center justify-center text-[11px] font-semibold text-[#F0821E]">{p.companyName?.[0]}</div>
                                  <div>
                                    <p className="text-[13px] font-medium">{p.companyName}</p>
                                    <p className="text-[11px] text-[#9A9488]">{p.user?.fullName || p.fullName}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[13px]">{p.serviceType}</td>
                              <td className="px-6 py-4 text-[12px] text-[#9A9488]">{p.city}, {p.state}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${gsb(p.verificationStatus)}`}>{p.verificationStatus || "pending"}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {isSuperAdmin && (
                                    <button onClick={() => openEditProvider(p)} className="p-1.5 rounded-lg hover:bg-blue-50" title="Edit Provider">
                                      <Edit3 className="h-4 w-4 text-blue-500" />
                                    </button>
                                  )}
                                  <button onClick={() => viewProviderDetails(p)} className="p-1.5 rounded-lg hover:bg-[#EFEDE6]">
                                    <Eye className="h-4 w-4 text-[#55605A]" />
                                  </button>
                                  {p.verificationStatus === "submitted" && (
                                    <button onClick={() => approveProvider(p._id)} className="p-1.5 rounded-lg hover:bg-green-50">
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
                  {/* Mobile Providers */}
                  <div className="md:hidden space-y-3 p-3">
                    {loading ? (
                      <p className="text-center py-12">Loading...</p>
                    ) : providers.length === 0 ? (
                      <p className="text-center py-12">No providers</p>
                    ) : (
                      providers.map((p) => (
                        <div key={p._id} className="bg-white rounded-xl border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#F0821E]/10 flex items-center justify-center font-semibold">{p.companyName?.[0]}</div>
                              <div>
                                <p className="text-[14px] font-semibold">{p.companyName}</p>
                                <p className="text-[11px] text-[#9A9488]">{p.serviceType} · {p.city}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${gsb(p.verificationStatus)}`}>{p.verificationStatus || "pending"}</span>
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                            {isSuperAdmin && (
                              <button onClick={() => openEditProvider(p)} className="flex-1 py-2 rounded-lg border text-[12px] font-medium text-blue-500">Edit</button>
                            )}
                            <button onClick={() => viewProviderDetails(p)} className="flex-1 py-2 rounded-lg border text-[12px] font-medium">View</button>
                            {p.verificationStatus === "submitted" && (
                              <button onClick={() => approveProvider(p._id)} className="flex-1 py-2 rounded-lg bg-[#1E7A34] text-white text-[12px] font-medium">Approve</button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {totalPages > 1 && <Pagination />}
                </div>
              )}
            </div>
          )}

          {/* ==================== QUOTES VIEW ==================== */}
          {activeView === "quotes" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6">Quotes & Bookings</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Customer</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Provider</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Service</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Amount</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Status</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Payment</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="7" className="text-center py-12">Loading...</td></tr>
                      ) : quotes.length === 0 ? (
                        <tr><td colSpan="7" className="text-center py-12">No quotes yet</td></tr>
                      ) : (
                        quotes.map((q, i) => (
                          <tr key={i} className="border-t hover:bg-[#F7F6F2]">
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">{q.customer?.name}</p>
                              <p className="text-[11px] text-[#9A9488]">{q.customer?.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">{q.provider?.name}</p>
                            </td>
                            <td className="px-6 py-4 text-[12px] max-w-[150px] truncate">{q.quote?.serviceDescription || "N/A"}</td>
                            <td className="px-6 py-4 font-semibold">₦{q.amount?.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${gqs(q.bookingStatus)}`}>
                                {q.bookingStatus?.replace(/_/g, " ") || "pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${q.payment?.status === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                {q.payment?.status || "unpaid"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                              {new Date(q.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== CONTACTS VIEW ==================== */}
          {activeView === "contacts" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6">Customer-Provider Contacts</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Customer</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Provider</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Service</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Last Contact</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Messages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="5" className="text-center py-12">Loading...</td></tr>
                      ) : contacts.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-12">No contacts yet</td></tr>
                      ) : (
                        contacts.map((c) => (
                          <tr key={c.id} className="border-t hover:bg-[#F7F6F2]">
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">{c.customerName}</p>
                              <p className="text-[11px] text-[#9A9488]">{c.customerEmail}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">{c.providerName}</p>
                            </td>
                            <td className="px-6 py-4 text-[13px]">{c.serviceType}</td>
                            <td className="px-6 py-4 text-[12px]">{new Date(c.lastContact).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-[13px]">{c.messageCount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ACTIVITY VIEW ==================== */}
          {activeView === "activity" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6">Provider Activity</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#F7F6F2]">
                      <tr>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Provider</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Service</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Status</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Last Active</th>
                        <th className="text-left px-6 py-3 text-[12px] font-semibold">Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="5" className="text-center py-12">Loading...</td></tr>
                      ) : activityData.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-12">No activity data</td></tr>
                      ) : (
                        activityData.map((p) => (
                          <tr key={p.id} className="border-t hover:bg-[#F7F6F2]">
                            <td className="px-6 py-4">
                              <p className="text-[13px] font-medium">{p.companyName}</p>
                              <p className="text-[11px] text-[#9A9488]">{p.fullName}</p>
                            </td>
                            <td className="px-6 py-4 text-[13px]">{p.serviceType}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.verificationStatus === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {p.verificationStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[12px]">
                              {p.lastActive ? new Date(p.lastActive).toLocaleDateString() : "Never"}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${p.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                {p.isAvailable ? "Yes" : "No"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== REPORTS VIEW ==================== */}
          {activeView === "reports" && (
            <div>
              <h2 className="text-[18px] font-semibold mb-6">Reports & Complaints</h2>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center py-12">Loading...</p>
                ) : reports.length === 0 ? (
                  <p className="text-center py-12 text-[#9A9488]">No reports</p>
                ) : (
                  reports.map((r) => (
                    <div key={r._id} className="bg-white rounded-xl border p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-semibold">{r.text}</p>
                          <p className="text-[12px] text-[#9A9488] mt-1">
                            From: {r.user?.fullName} ({r.user?.email})
                          </p>
                          <p className="text-[11px] text-[#9A9488]">
                            {new Date(r.createdAt).toLocaleString()}
                          </p>
                          {r.metadata?.fullMessage && (
                            <p className="text-[12px] text-[#55605A] mt-2 bg-[#F7F6F2] p-3 rounded-lg">
                              "{r.metadata.fullMessage}"
                            </p>
                          )}
                        </div>
                        {r.kind === "report" && (
                          <button
                            onClick={() => resolveReport(r._id)}
                            className="px-3 py-1.5 rounded-lg bg-[#1E7A34] text-white text-[12px] font-semibold hover:bg-[#166B2C] ml-4 flex-shrink-0"
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

          {/* ==================== ADMINS VIEW ==================== */}
          {activeView === "admins" && isSuperAdmin && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[18px] font-semibold">Admin Management</h2>
                <button
                  onClick={() => setShowAddAdmin(true)}
                  className="rounded-lg bg-[#1E7A34] px-4 py-2 text-[13px] font-semibold text-white flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" /> Add Admin
                </button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F7F6F2]">
                    <tr>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">Name</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">Email</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">Role</th>
                      <th className="text-left px-6 py-3 text-[12px] font-semibold">Last Login</th>
                      <th className="text-right px-6 py-3 text-[12px] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((a) => (
                      <tr key={a._id} className="border-t hover:bg-[#F7F6F2]">
                        <td className="px-6 py-4 text-[13px] font-medium">{a.fullName}</td>
                        <td className="px-6 py-4 text-[13px]">{a.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${a.role === "super_admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {a.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[12px] text-[#9A9488]">
                          {a.lastLogin ? new Date(a.lastLogin).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {a.role !== "super_admin" && (
                            <button onClick={() => deleteAdmin(a._id)} className="p-1.5 rounded-lg hover:bg-red-50">
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

          {/* ==================== SETTINGS VIEW ==================== */}
          {activeView === "settings" && (
            <div className="bg-white rounded-xl border p-4 md:p-6 max-w-2xl">
              <h3 className="text-[16px] md:text-[18px] font-semibold mb-4 md:mb-6">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold mb-2">Site Name</label>
                  <input type="text" defaultValue="9jaTradiesPages" className="w-full rounded-lg border px-4 py-2.5 text-[13px]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold mb-2">Support Email</label>
                  <input type="email" defaultValue="support@9jatradiespages.com" className="w-full rounded-lg border px-4 py-2.5 text-[13px]" />
                </div>
                <button className="rounded-lg bg-[#1E7A34] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#166B2C]">Save</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==================== EDIT MODAL ==================== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl z-10 flex items-center justify-between p-4 border-b">
              <h3 className="text-[15px] font-semibold">
                Edit {editType === "user" ? "User" : "Provider"}
              </h3>
              <button onClick={() => { setShowEditModal(false); setEditingUser(null); setEditingProvider(null); }} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]">
                <X className="h-5 w-5 text-[#55605A]" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {editType === "user" && (
                <>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Full Name</label>
                    <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Phone</label>
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Account Type</label>
                    <select value={editForm.accountType} onChange={(e) => setEditForm({...editForm, accountType: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]">
                      <option value="customer">Customer</option>
                      <option value="provider">Provider</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="userActive" checked={editForm.isActive} onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} className="h-4 w-4" />
                    <label htmlFor="userActive" className="text-[13px] font-semibold">Active</label>
                  </div>
                </>
              )}
              {editType === "provider" && (
                <>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Company Name</label>
                    <input type="text" value={editForm.companyName} onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Full Name</label>
                    <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Phone</label>
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Service Type</label>
                    <input type="text" value={editForm.serviceType} onChange={(e) => setEditForm({...editForm, serviceType: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">City</label>
                      <input type="text" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-2">State</label>
                      <input type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-2">Verification Status</label>
                    <select value={editForm.verificationStatus} onChange={(e) => setEditForm({...editForm, verificationStatus: e.target.value})} className="w-full rounded-lg border px-4 py-2.5 text-[14px]">
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="provVisible" checked={editForm.isVisible} onChange={(e) => setEditForm({...editForm, isVisible: e.target.checked})} className="h-4 w-4" />
                      <label htmlFor="provVisible" className="text-[13px] font-semibold">Visible</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="provAvailable" checked={editForm.isAvailable} onChange={(e) => setEditForm({...editForm, isAvailable: e.target.checked})} className="h-4 w-4" />
                      <label htmlFor="provAvailable" className="text-[13px] font-semibold">Available</label>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 p-4 border-t justify-end">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg border text-[13px] font-semibold">Cancel</button>
              <button onClick={editType === "user" ? saveUserEdit : saveProviderEdit} className="px-4 py-2 rounded-lg bg-[#1E7A34] text-[13px] font-semibold text-white flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== REJECT MODAL ==================== */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-[16px] font-semibold mb-4">Reject Provider</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Reason..." className="w-full rounded-lg border px-4 py-3 text-[14px] resize-none" />
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(""); }} className="px-4 py-2 rounded-lg border text-[13px] font-semibold">Cancel</button>
              <button onClick={rejectProvider} className="px-4 py-2 rounded-lg bg-red-600 text-[13px] font-semibold text-white">Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== USER DETAILS MODAL ==================== */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl z-10 flex items-center justify-between p-4 border-b">
              <h3 className="text-[15px] font-semibold">User Details</h3>
              <button onClick={() => { setShowUserModal(false); setSelectedUser(null); }} className="p-1.5 rounded-lg hover:bg-[#F7F6F2]"><X className="h-5 w-5 text-[#55605A]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[22px] font-bold">{selectedUser.fullName?.[0]}</div>
                <div>
                  <h3 className="text-[16px] font-semibold">{selectedUser.fullName}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${selectedUser.accountType==="provider"?"bg-[#F0821E]/10 text-[#F0821E]":"bg-[#1E7A34]/10 text-[#1E7A34]"}`}>{selectedUser.accountType}</span>
                </div>
              </div>
              <div className="space-y-3 bg-[#F7F6F2] rounded-xl p-4">
                <div className="flex justify-between text-[13px]"><span className="text-[#9A9488]">Email</span><span className="font-medium">{selectedUser.email}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-[#9A9488]">Phone</span><span className="font-medium">{fp(selectedUser.phone)}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-[#9A9488]">Status</span><span className={`font-medium ${selectedUser.isActive?"text-green-600":"text-red-600"}`}>{selectedUser.isActive?"Active":"Disabled"}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-[#9A9488]">Joined</span><span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADD ADMIN MODAL ==================== */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-[16px] font-semibold mb-4">Add Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold mb-2">Full Name</label>
                <input type="text" value={newAdmin.fullName} onChange={(e) => setNewAdmin((p) => ({ ...p, fullName: e.target.value }))} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-2">Email</label>
                <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-2">Password</label>
                <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-lg border px-4 py-2.5 text-[14px]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-2">Role</label>
                <select value={newAdmin.role} onChange={(e) => setNewAdmin((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-lg border px-4 py-2.5 text-[14px]">
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowAddAdmin(false)} className="px-4 py-2 rounded-lg border text-[13px] font-semibold">Cancel</button>
              <button onClick={createAdmin} className="px-4 py-2 rounded-lg bg-[#1E7A34] text-[13px] font-semibold text-white">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}