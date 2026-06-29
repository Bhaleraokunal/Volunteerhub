import { useQuery } from "@tanstack/react-query";
import { toggleRegistration } from "../../api/event.api";
import { logoutUser } from "../../api/user.api";
import {
  organizerEvents,
  deleteEvent
} from "../../api/event.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useState, useRef } from "react";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["organizer-events"],
    queryFn: organizerEvents
  });

  const events = data?.data.data || [];

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    refetch();
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-semibold text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f1729] overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a2332] border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-white font-bold text-lg">EventHub</span>
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
            className="flex items-center gap-3 px-4 py-3 bg-purple-600 rounded-lg cursor-pointer"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {sidebarOpen && <span className="text-white font-medium">Dashboard</span>}
          </div>

          <div 
            onClick={() => navigate("/organizer/create")}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {sidebarOpen && <span className="font-medium">Create Event</span>}
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
              <h1 className="text-2xl font-bold text-white">Organizer Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your events and registrations</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search events..."
                  className="bg-[#0f1729] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white text-sm focus:outline-none focus:border-purple-500 w-64"
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
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.emailId?.charAt(0).toUpperCase() || "O"}
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

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Total Events</p>
                  <p className="text-white text-3xl font-bold mt-1">{events.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500">↗ 12%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Open Registration</p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {events.filter((e: any) => e.registrationAllowed).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500">↗ 8%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>

            <div className="bg-[#1a2332] rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-400 text-sm">Closed</p>
                  <p className="text-white text-3xl font-bold mt-1">
                    {events.filter((e: any) => !e.registrationAllowed).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔒</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-500">↘ 3%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          </div>

          {/* Events Section */}
          {events.length === 0 ? (
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-12 text-center">
              <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Events Yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">You haven't created any events. Start by creating your first event!</p>
              <button 
                onClick={() => navigate("/organizer/create")}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Your Events</h2>
                <button
                  onClick={() => navigate("/organizer/create")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Event
                </button>
              </div>

              {events.map((e: any) => (
                <div key={e.eventId} className="bg-[#1a2332] rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{e.eventName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          e.registrationAllowed 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {e.registrationAllowed ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                              OPEN
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                              CLOSED
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{e.city}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{e.eventStartDate} → {e.eventEndDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => navigate(`/organizer/edit/${e.eventId}`)}
                      className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>

                    <button 
                      onClick={() => navigate(`/organizer/registrations/${e.eventId}`)}
                      className="px-3 py-2 bg-[#0f1729] border border-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Registrations
                    </button>

                    <button
                      onClick={() =>
                        toggleRegistration(e.eventId, !e.registrationAllowed)
                          .then(() => refetch())
                      }
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        e.registrationAllowed
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {e.registrationAllowed ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Close
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                          Open
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => handleDelete(e.eventId)}
                      className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}