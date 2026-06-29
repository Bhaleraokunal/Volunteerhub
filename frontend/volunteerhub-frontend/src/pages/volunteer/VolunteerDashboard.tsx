import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { logoutUser } from "../../api/user.api";
import { useState, useRef } from "react";

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || "");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log("TOKEN:", localStorage.getItem("token"));

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem("userAvatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f1729] overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a2332] border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-white font-bold text-lg">VolunHub</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div 
            className="flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-lg cursor-pointer"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span className="text-white font-medium">Dashboard</span>}
          </div>

          <div 
            onClick={() => navigate("/events")}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {sidebarOpen && <span className="font-medium">Browse Events</span>}
          </div>

          <div 
            onClick={() => navigate("/volunteer/registrations")}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {sidebarOpen && <span className="font-medium">My Registrations</span>}
          </div>

          <div 
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {sidebarOpen && <span className="font-medium">Profile</span>}
          </div>

          <div 
            onClick={() => navigate("/reset-password")}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {sidebarOpen && <span className="font-medium">Security</span>}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={async () => {
              try {
                await logoutUser();
              } catch (e) {
                console.error("Logout API failed", e);
              }
              localStorage.removeItem("token");
              await logout();
              navigate("/");
            }}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg cursor-pointer transition-colors w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-[#1a2332] border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back, {user?.emailId?.split('@')[0] || 'Volunteer'}!</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="bg-[#0f1729] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white text-sm focus:outline-none focus:border-blue-500 w-64"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Avatar */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.emailId?.charAt(0).toUpperCase() || "V"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a2332]"></div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-blue-100 text-sm mb-4">
                  {user?.emailId || 'volunteer@example.com'}
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-blue-200 text-xs">Active Status</p>
                    <p className="text-white font-bold text-lg">Volunteer</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs">Member Since</p>
                    <p className="text-white font-bold text-lg">2024</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="62.8" transform="rotate(-90 50 50)"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">78%</span>
                  </div>
                </div>
                <p className="text-white text-xs text-center mt-2">Profile Complete</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Events Joined */}
            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Events Joined</p>
                  <p className="text-white text-3xl font-bold mt-1">-</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500">↗ 12%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            {/* Hours Contributed */}
            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Total Hours</p>
                  <p className="text-white text-3xl font-bold mt-1">-</p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏱️</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500">↗ 8%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            {/* Impact Score */}
            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Impact Score</p>
                  <p className="text-white text-3xl font-bold mt-1">-</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-500">↘ 3%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                  <p className="text-white text-3xl font-bold mt-1">-</p>
                </div>
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500">↗ 5%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Monthly Activity */}
            <div className="lg:col-span-2 bg-[#1a2332] rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">Monthly Activity</h3>
                <select className="bg-[#0f1729] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-400 text-sm">
                  <option>Last 6 months</option>
                </select>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg hover:from-blue-500 hover:to-cyan-400 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-gray-500 text-xs">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Distribution */}
            <div className="bg-[#1a2332] rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-bold text-lg mb-6">Activity Type</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="12"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="170 251.2"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="50 251.2" strokeDashoffset="-170"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="31.4 251.2" strokeDashoffset="-220"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-2xl font-bold">68%</p>
                      <p className="text-gray-400 text-xs">Total</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Community</span>
                  </div>
                  <span className="text-white font-medium text-sm">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Education</span>
                  </div>
                  <span className="text-white font-medium text-sm">20%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Environment</span>
                  </div>
                  <span className="text-white font-medium text-sm">12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate("/events")}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1">Browse Events</h4>
              <p className="text-blue-100 text-xs">Find opportunities</p>
            </div>

            <div 
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1">Edit Profile</h4>
              <p className="text-green-100 text-xs">Update details</p>
            </div>

            <div 
              onClick={() => navigate("/reset-password")}
              className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔐</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1">Security</h4>
              <p className="text-red-100 text-xs">Change password</p>
            </div>

            <div 
              onClick={() => navigate("/volunteer/registrations")}
              className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
              <h4 className="text-white font-bold mb-1">My Events</h4>
              <p className="text-purple-100 text-xs">View registrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
