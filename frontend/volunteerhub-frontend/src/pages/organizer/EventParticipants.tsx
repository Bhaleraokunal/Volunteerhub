import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export default function EventParticipants() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const registrationsQuery = useQuery({
    queryKey: ["registrations", eventId],
    queryFn: () =>
      api.get(`/event/registration/event/${eventId}/registrations`)
  });

  const participantsQuery = useQuery({
    queryKey: ["participants", eventId],
    queryFn: () =>
      api.get(`/event/registration/event/${eventId}/participants`)
  });

  if (registrationsQuery.isLoading || participantsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-800">Loading registrations...</p>
          <p className="text-sm text-gray-600">Fetching volunteer data</p>
        </div>
      </div>
    );
  }

  const registrations = registrationsQuery.data?.data?.data || [];
  const participants = participantsQuery.data?.data?.data || [];

  const registrationRate = registrations.length > 0 
    ? Math.round((participants.length / registrations.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    Event Registrations
                  </h1>
                </div>
                <p className="text-gray-600">Track and manage your volunteer registrations</p>
              </div>
              <button
                onClick={() => navigate("/organizer/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Registered</p>
                    <p className="text-3xl font-bold text-blue-700">{registrations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-600 text-xs font-semibold uppercase tracking-wide">Checked In</p>
                    <p className="text-3xl font-bold text-green-700">{participants.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-purple-600 text-xs font-semibold uppercase tracking-wide">Attendance Rate</p>
                    <p className="text-3xl font-bold text-purple-700">{registrationRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registered Users */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-fit">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Registered Volunteers
              </h2>
              <p className="text-blue-100 mt-1 text-sm">
                {registrations.length} {registrations.length === 1 ? 'volunteer has' : 'volunteers have'} signed up
              </p>
            </div>

            <div className="p-6">
              {registrations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Registrations Yet</h3>
                  <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                    Don't worry! It's still early. Volunteers will discover your event soon.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
                    <p className="text-sm font-semibold text-blue-900 mb-2">💡 Tips to attract volunteers:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Share your event on social media</li>
                      <li>• Ensure registration is open</li>
                      <li>• Add a compelling description</li>
                      <li>• Reach out to local communities</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {registrations.map((email: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium flex-1">{email}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                        #{index + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Checked-in Users */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-fit">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Checked-in Participants
              </h2>
              <p className="text-green-100 mt-1 text-sm">
                {participants.length} {participants.length === 1 ? 'volunteer has' : 'volunteers have'} attended
              </p>
            </div>

            <div className="p-6">
              {participants.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Check-ins Yet</h3>
                  <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                    {registrations.length > 0 
                      ? "Volunteers will check in as they arrive at the event."
                      : "Once volunteers register, they'll be able to check in here."
                    }
                  </p>
                  {registrations.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md mx-auto">
                      <p className="text-sm font-semibold text-green-900 mb-2">✨ Great news!</p>
                      <p className="text-sm text-green-800">
                        You have {registrations.length} registered {registrations.length === 1 ? 'volunteer' : 'volunteers'}. 
                        They'll show up here once they check in at the event.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {participants.map((email: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 bg-green-50"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-green-800 font-medium flex-1">{email}</span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                        Present
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Encouragement Card - Only show when there are registrations but not many participants yet */}
        {registrations.length > 0 && participants.length === 0 && (
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-900 mb-2">Your Event is Building Momentum! 🚀</h3>
                <p className="text-indigo-800 mb-3">
                  You have <span className="font-bold">{registrations.length}</span> registered {registrations.length === 1 ? 'volunteer' : 'volunteers'}! 
                  That's a great start. As the event approaches, expect more sign-ups and check-ins.
                </p>
                <div className="flex items-center gap-2 text-sm text-indigo-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Keep the energy up by staying connected with your volunteers!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Card - Show when there are good numbers */}
        {registrations.length > 0 && participants.length > 0 && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Excellent Engagement! 🎉</h3>
                <p className="text-green-800">
                  Your event is performing well with <span className="font-bold">{registrationRate}%</span> attendance rate. 
                  {registrationRate >= 75 && " That's outstanding!"} 
                  {registrationRate >= 50 && registrationRate < 75 && " Keep up the great work!"}
                  {registrationRate < 50 && " There's still time for more volunteers to check in!"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}