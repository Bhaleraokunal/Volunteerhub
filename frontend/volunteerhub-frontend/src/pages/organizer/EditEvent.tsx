import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvent, updateEvent } from "../../api/event.api";

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      setInitialLoading(true);
      getEvent(Number(eventId)).then(res => {
        setForm(res.data.data);
        setInitialLoading(false);
      });
    }
  }, [eventId]);

  const submit = async () => {
    try {
      setLoading(true);
      await updateEvent(Number(eventId), form);
      navigate("/organizer/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-semibold text-lg">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a] p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/organizer/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Edit Event
          </h1>
          <p className="text-gray-400">Update your event information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Event Details Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Event Details</h2>
              </div>

              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Event Name
                  </label>
                  <input 
                    placeholder="e.g., Beach Cleanup Drive"
                    value={form.eventName || ""}
                    onChange={e => setForm({ ...form, eventName: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1729] border border-gray-700 rounded-xl outline-none text-white placeholder-gray-500 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Description
                  </label>
                  <textarea 
                    placeholder="Describe what volunteers will do, what to bring, dress code, etc..."
                    value={form.description || ""}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-[#0f1729] border border-gray-700 rounded-xl outline-none text-white placeholder-gray-500 resize-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Location</h2>
              </div>

              <div className="space-y-4">
                {/* City */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    City
                  </label>
                  <input 
                    placeholder="Enter city name"
                    value={form.city || ""}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1729] border border-gray-700 rounded-xl outline-none text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Address
                  </label>
                  <input 
                    placeholder="Enter full address"
                    value={form.address || ""}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1729] border border-gray-700 rounded-xl outline-none text-white placeholder-gray-500 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Tips Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-5 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-400">Editing Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Ensure all information is accurate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Detailed descriptions help volunteers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Changes reflect immediately after saving</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Double-check location details</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={submit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating Event...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Event
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/organizer/dashboard")}
                disabled={loading}
                className="w-full px-6 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-all border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}