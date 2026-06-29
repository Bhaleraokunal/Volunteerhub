import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyRegistrations } from "../../api/registration.api";

export default function MyRegistrations() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: getMyRegistrations
  });

  const events = data?.data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading your registrations...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-600 font-medium mb-4">Failed to load registrations</p>
          <p className="text-gray-600 text-sm mb-6">Please check your connection and try again</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                My Registrations
              </h1>
              <p className="text-gray-600 mt-1">
                {events.length} {events.length === 1 ? 'event' : 'events'} registered
              </p>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📭</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Registrations Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't registered for any events yet. Start exploring opportunities and make a difference!
            </p>
            <button
              onClick={() => navigate("/events")}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold transform hover:scale-105"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e: any) => (
              <div
                key={e.eventId}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group transform hover:-translate-y-1"
              >
                {/* Card Header with Gradient */}
                <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <span className="text-sm">🎯</span>
                      </div>
                      <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                        Registered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {e.eventName}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-6">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{e.city}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/event/${e.eventId}`)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 group-hover:scale-105"
                  >
                    View Details
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Tip */}
        {events.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Stay Prepared</h3>
                <p className="text-gray-600 text-sm">
                  Click on any event to view full details, check schedules, and prepare for your volunteering experience.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}