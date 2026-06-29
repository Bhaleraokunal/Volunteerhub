import { useState } from "react";
import { createEvent } from "../../api/event.api";
import { useNavigate } from "react-router-dom";

interface FormErrors {
  eventName?: string;
  description?: string;
  city?: string;
  address?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  maxAllowedRegistrations?: string;
}

interface CreateEventForm {
  eventName?: string;
  description?: string;
  city?: string;
  address?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  maxAllowedRegistrations?: number;
  registrationAllowed: boolean;
  isPaid: boolean;
  price: number;
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateEventForm>({
    registrationAllowed: true,
    isPaid: false,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateEventName = (value: string): string | undefined => {
    if (!value || !value.trim()) return "Event name is required";
    if (value.trim().length < 3) return "Event name must be at least 3 characters";
    if (value.trim().length > 100) return "Event name must not exceed 100 characters";
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value || !value.trim()) return "Description is required";
    if (value.trim().length < 20) return "Description must be at least 20 characters";
    if (value.trim().length > 2000) return "Description must not exceed 2000 characters";
    return undefined;
  };

  const validateCity = (value: string): string | undefined => {
    if (!value || !value.trim()) return "City is required";
    if (value.trim().length < 2) return "City name must be at least 2 characters";
    if (!/^[a-zA-Z\s\-']+$/.test(value.trim()))
      return "City name can only contain letters, spaces, hyphens, and apostrophes";
    return undefined;
  };

  const validateAddress = (value: string): string | undefined => {
    if (!value || !value.trim()) return "Address is required";
    if (value.trim().length < 10) return "Please provide a complete address (at least 10 characters)";
    if (value.trim().length > 200) return "Address must not exceed 200 characters";
    return undefined;
  };

  const validateStartDate = (value: string): string | undefined => {
    if (!value) return "Start date is required";
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Start date cannot be in the past";
    return undefined;
  };

  const validateEndDate = (startDate: string, endDate: string): string | undefined => {
    if (!endDate) return "End date is required";
    if (!startDate) return "Please select a start date first";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return "End date must be after start date";
    if (end.getTime() === start.getTime()) return "End date must be different from start date";
    return undefined;
  };

  const validateMaxRegistrations = (value: number): string | undefined => {
    if (!value) return "Maximum registrations is required";
    if (value < 1) return "Must allow at least 1 registration";
    if (value > 10000) return "Maximum registrations cannot exceed 10,000";
    if (!Number.isInteger(value)) return "Must be a whole number";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      eventName: validateEventName(form.eventName || ""),
      description: validateDescription(form.description || ""),
      city: validateCity(form.city || ""),
      address: validateAddress(form.address || ""),
      eventStartDate: validateStartDate(form.eventStartDate || ""),
      eventEndDate: validateEndDate(form.eventStartDate || "", form.eventEndDate || ""),
      maxAllowedRegistrations: validateMaxRegistrations(form.maxAllowedRegistrations || 0),
    };
    setErrors(newErrors);
    setTouched({
      eventName: true,
      description: true,
      city: true,
      address: true,
      eventStartDate: true,
      eventEndDate: true,
      maxAllowedRegistrations: true,
    });
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    let error: string | undefined;
    switch (field) {
      case "eventName":
        error = validateEventName(form.eventName || "");
        break;
      case "description":
        error = validateDescription(form.description || "");
        break;
      case "city":
        error = validateCity(form.city || "");
        break;
      case "address":
        error = validateAddress(form.address || "");
        break;
      case "eventStartDate":
        error = validateStartDate(form.eventStartDate || "");
        if (form.eventEndDate) {
          setErrors((prev) => ({
            ...prev,
            eventStartDate: error,
            eventEndDate: validateEndDate(form.eventStartDate || "", form.eventEndDate || ""),
          }));
          return;
        }
        break;
      case "eventEndDate":
        error = validateEndDate(form.eventStartDate || "", form.eventEndDate || "");
        break;
      case "maxAllowedRegistrations":
        error = validateMaxRegistrations(form.maxAllowedRegistrations || 0);
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const submit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      await createEvent(form);
      navigate("/organizer/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1.5 text-red-400 text-sm mt-1">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  };

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
            Create New Event
          </h1>
          <p className="text-gray-400">Fill in the details to create your volunteer event</p>
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
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Event Name *</label>
                  <input
                    placeholder="e.g., Beach Cleanup Drive"
                    value={form.eventName || ""}
                    onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                    onBlur={() => handleBlur("eventName")}
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                      touched.eventName && errors.eventName
                        ? "border-red-500"
                        : "border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  />
                  {touched.eventName && <ErrorMessage error={errors.eventName} />}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Description *</label>
                  <textarea
                    placeholder="Describe what volunteers will do, what to bring, dress code, etc..."
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    onBlur={() => handleBlur("description")}
                    rows={5}
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 resize-none transition-all ${
                      touched.description && errors.description
                        ? "border-red-500"
                        : "border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  />
                  {touched.description && <ErrorMessage error={errors.description} />}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">Min 20 characters</span>
                    <span className="text-xs text-gray-500">{form.description?.length || 0} / 2000</span>
                  </div>
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
                {/* Plain text address input — no Google Maps */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Address *</label>
                  <input
                    type="text"
                    placeholder="e.g., 123 Main Street, Downtown"
                    value={form.address || ""}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    onBlur={() => handleBlur("address")}
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                      touched.address && errors.address
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                  {touched.address && <ErrorMessage error={errors.address} />}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">City *</label>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={form.city || ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    onBlur={() => handleBlur("city")}
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                      touched.city && errors.city
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                  />
                  {touched.city && <ErrorMessage error={errors.city} />}
                </div>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Schedule & Capacity</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Start Date *</label>
                  <input
                    type="date"
                    value={form.eventStartDate || ""}
                    onChange={(e) => setForm({ ...form, eventStartDate: e.target.value })}
                    onBlur={() => handleBlur("eventStartDate")}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white transition-all ${
                      touched.eventStartDate && errors.eventStartDate
                        ? "border-red-500"
                        : "border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    }`}
                  />
                  {touched.eventStartDate && <ErrorMessage error={errors.eventStartDate} />}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">End Date *</label>
                  <input
                    type="date"
                    value={form.eventEndDate || ""}
                    onChange={(e) => setForm({ ...form, eventEndDate: e.target.value })}
                    onBlur={() => handleBlur("eventEndDate")}
                    min={form.eventStartDate || new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white transition-all ${
                      touched.eventEndDate && errors.eventEndDate
                        ? "border-red-500"
                        : "border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    }`}
                  />
                  {touched.eventEndDate && <ErrorMessage error={errors.eventEndDate} />}
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Maximum Volunteers *</label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={form.maxAllowedRegistrations || ""}
                  onChange={(e) => setForm({ ...form, maxAllowedRegistrations: Number(e.target.value) })}
                  onBlur={() => handleBlur("maxAllowedRegistrations")}
                  min="1"
                  max="10000"
                  className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                    touched.maxAllowedRegistrations && errors.maxAllowedRegistrations
                      ? "border-red-500"
                      : "border-gray-700 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  }`}
                />
                {touched.maxAllowedRegistrations && <ErrorMessage error={errors.maxAllowedRegistrations} />}
              </div>
            </div>

            {/* Event Type Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Event Type</h2>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPaid: false, price: 0 })}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                    !form.isPaid
                      ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPaid: true })}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                    form.isPaid
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Paid
                </button>
              </div>
              {form.isPaid && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="e.g., 499"
                    value={form.price || ""}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-3 bg-[#0f1729] border border-gray-700 rounded-xl outline-none text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 p-5 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-400">Registration Status</h3>
              </div>
              <p className="text-green-300 text-sm leading-relaxed">
                Registration will be <span className="font-bold">OPEN</span> by default when you create this event. You can manage it later from your dashboard.
              </p>
            </div>

            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-400">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Use a clear, descriptive event name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Include specific details in description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Set realistic registration limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Double-check dates and address</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={submit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
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