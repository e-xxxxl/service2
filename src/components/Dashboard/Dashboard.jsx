// components/Dashboard/CustomerDashboard.jsx
import React, { useState } from 'react';
import { 
  Search, Bell, MessageCircle, Heart, User, Calendar, 
  MapPin, Star, Clock 
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('discover');

  // Mock data (replace with real data later)
  const recentPros = [
    { id: 1, name: "David Okon", service: "Plumbing", location: "Lagos", rating: 4.9, avatar: "https://i.pravatar.cc/150?u=david" },
    { id: 2, name: "Aisha Bello", service: "Electrical", location: "Abuja", rating: 5.0, avatar: "https://i.pravatar.cc/150?u=aisha" },
  ];

  const notifications = [
    { id: 1, message: "Chinedu replied to your message", time: "2m ago", unread: true },
    { id: 2, message: "Your booking request was accepted", time: "1h ago", unread: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-[#f06d00]">Fixly</div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services, plumbers, electricians..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/30"
              />
            </div>

            <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="flex items-center gap-3 pl-4 border-l">
              <img src="https://i.pravatar.cc/150?u=user" alt="Profile" className="w-9 h-9 rounded-full" />
              <div className="text-left">
                <p className="text-sm font-medium">Jordan Ellis</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Welcome back, Jordan 👋</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Saved Providers", value: "12", icon: Heart },
            { label: "Conversations", value: "7", icon: MessageCircle },
            { label: "Bookings", value: "3", icon: Calendar },
            { label: "Active Requests", value: "2", icon: Clock },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-4xl font-semibold mt-2">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-[#f06d00]" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Discover Services */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Find Professionals</h2>
                <button className="text-[#f06d00] font-medium flex items-center gap-2 hover:underline">
                  Browse all categories →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Plumbing', 'Electrical', 'Cleaning', 'HVAC', 'Painting', 'Landscaping', 'Roofing', 'Carpentry'].map((cat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl hover:shadow-md hover:border-[#f06d00]/30 border border-transparent cursor-pointer transition-all">
                    <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      🛠️
                    </div>
                    <p className="font-medium">{cat}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Contacted */}
            <div>
              <h2 className="text-xl font-semibold mb-5">Recently Contacted</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPros.map(pro => (
                  <div key={pro.id} className="bg-white rounded-2xl p-6 flex gap-5 border border-gray-100 hover:border-[#f06d00]/30 transition-all">
                    <img src={pro.avatar} alt="" className="w-16 h-16 rounded-2xl" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{pro.name}</h3>
                        <div className="flex items-center text-yellow-500 text-sm">
                          ★ {pro.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{pro.service}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" /> {pro.location}
                      </p>
                      <button className="mt-4 text-sm bg-[#f06d00] text-white px-5 py-2 rounded-xl hover:bg-[#e05f00] transition-colors">
                        Message again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Notifications */}
            <div className="bg-white rounded-3xl p-6">
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Bell className="w-5 h-5" /> Notifications
              </h3>
              {notifications.map(notif => (
                <div key={notif.id} className={`py-4 border-b last:border-0 ${notif.unread ? 'bg-orange-50 -mx-6 px-6' : ''}`}>
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6">
              <h3 className="font-semibold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">📍</div>
                  <div>
                    <p className="font-medium">Post a New Request</p>
                    <p className="text-sm text-gray-500">Get quotes fast</p>
                  </div>
                </button>

                <button className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">💬</div>
                  <div>
                    <p className="font-medium">Open Messages</p>
                    <p className="text-sm text-gray-500">3 unread</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;