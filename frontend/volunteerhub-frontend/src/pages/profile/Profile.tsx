import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { updateUserProfile } from "../../api/user.api";

type ProfileForm = {
  emailId: string;
  phoneNumber: string;
  address: string;
  userRole: string;
};

interface FormErrors {
  phoneNumber?: string;
  address?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState<ProfileForm>({
    emailId: user?.emailId || "",
    phoneNumber: user?.phoneNumber ? String(user.phoneNumber) : "",
    address: user?.address || "",
    userRole: user?.userRole || ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validatePhoneNumber = (value: string): string | undefined => {
    if (!value || !value.trim()) {
      return "Phone number is required";
    }
    if (!/^\d+$/.test(value)) {
      return "Phone number must contain only digits";
    }
    if (value.length < 10) {
      return "Phone number must be at least 10 digits";
    }
    if (value.length > 15) {
      return "Phone number must not exceed 15 digits";
    }
    return undefined;
  };

  const validateAddress = (value: string): string | undefined => {
    if (!value || !value.trim()) {
      return "Address is required";
    }
    if (value.trim().length < 5) {
      return "Address must be at least 5 characters";
    }
    if (value.trim().length > 200) {
      return "Address must not exceed 200 characters";
    }
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    
    let error: string | undefined;
    switch (field) {
      case "phoneNumber":
        error = validatePhoneNumber(form.phoneNumber);
        break;
      case "address":
        error = validateAddress(form.address);
        break;
    }
    
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear message when user starts typing
    if (msg) setMsg("");
    
    // Real-time validation for touched fields
    if (touched[name]) {
      let error: string | undefined;
      if (name === "phoneNumber") {
        error = validatePhoneNumber(value);
      } else if (name === "address") {
        error = validateAddress(value);
      }
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      phoneNumber: validatePhoneNumber(form.phoneNumber),
      address: validateAddress(form.address),
    };

    setErrors(newErrors);
    setTouched({
      phoneNumber: true,
      address: true,
    });

    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setMsg("Please fix the errors before submitting");
      setMsgType("error");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await updateUserProfile({
        emailId: form.emailId,
        phoneNumber: Number(form.phoneNumber),
        address: form.address
      });

      setUser(res.data.data);
      setMsg("Profile updated successfully!");
      setMsgType("success");

      setTimeout(() => {
        navigate(-1);
      }, 1000);

    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Profile update failed");
      setMsgType("error");
    }

    setLoading(false);
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
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-400">Update your personal information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Account Information Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Account Information</h2>
              </div>

              <div className="space-y-4">
                {/* Email (Read-only) */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      disabled
                      value={form.emailId}
                      name="emailId"
                      className="w-full px-4 py-3 bg-[#0f1729]/50 border border-gray-700/50 rounded-xl outline-none text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email cannot be changed
                  </p>
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    User Role
                  </label>
                  <div className="relative">
                    <input
                      disabled
                      value={form.userRole}
                      className="w-full px-4 py-3 bg-[#0f1729]/50 border border-gray-700/50 rounded-xl outline-none text-gray-500 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        form.userRole === 'ORGANIZER' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {form.userRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Contact Details</h2>
              </div>

              <div className="space-y-4">
                {/* Phone Number */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number *
                  </label>
                  <input
                    value={form.phoneNumber}
                    name="phoneNumber"
                    onChange={handleChange}
                    onBlur={() => handleBlur("phoneNumber")}
                    placeholder="Enter your phone number"
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                      touched.phoneNumber && errors.phoneNumber 
                        ? "border-red-500" 
                        : "border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  />
                  {touched.phoneNumber && <ErrorMessage error={errors.phoneNumber} />}
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address *
                  </label>
                  <input
                    value={form.address}
                    name="address"
                    onChange={handleChange}
                    onBlur={() => handleBlur("address")}
                    placeholder="Enter your full address"
                    className={`w-full px-4 py-3 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                      touched.address && errors.address 
                        ? "border-red-500" 
                        : "border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  />
                  {touched.address && <ErrorMessage error={errors.address} />}
                </div>
              </div>
            </div>

            {/* Status Message */}
            {msg && (
              <div className={`rounded-xl p-4 flex items-center gap-3 ${
                msgType === "success" 
                  ? "bg-green-500/10 border border-green-500/20" 
                  : "bg-red-500/10 border border-red-500/20"
              } animate-fadeIn`}>
                {msgType === "success" ? (
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className={msgType === "success" ? "text-green-300" : "text-red-300"}>
                  {msg}
                </span>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Profile Info Card */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 p-5 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-purple-400">Profile Status</h3>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed mb-3">
                Keep your profile information up to date for better communication.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Profile Active</span>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-400">Quick Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Use a valid phone number for notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Provide complete address details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Email and role cannot be modified</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Profile
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(-1)}
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