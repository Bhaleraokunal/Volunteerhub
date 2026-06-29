import { useState } from "react";
import { resetPassword } from "../../api/user.api";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface FormErrors {
  oldPassword?: string;
  newPassword?: string;
}

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const { logout } = useAuth();
  const navigate = useNavigate();

  const validateOldPassword = (value: string): string | undefined => {
    if (!value || !value.trim()) {
      return "Current password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  const validateNewPassword = (value: string): string | undefined => {
    if (!value || !value.trim()) {
      return "New password is required";
    }
    if (value.length < 8) {
      return "New password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(value)) {
      return "Password must contain at least one number";
    }
    if (oldPassword && value === oldPassword) {
      return "New password must be different from current password";
    }
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    
    let error: string | undefined;
    if (field === "oldPassword") {
      error = validateOldPassword(oldPassword);
    } else if (field === "newPassword") {
      error = validateNewPassword(newPassword);
    }
    
    setErrors({ ...errors, [field]: error });
  };

  const handleOldPasswordChange = (value: string) => {
    setOldPassword(value);
    if (message) setMessage("");
    
    if (touched.oldPassword) {
      const error = validateOldPassword(value);
      setErrors(prev => ({ ...prev, oldPassword: error }));
    }
    
    // Re-validate new password if it exists (to check if they're the same)
    if (touched.newPassword && newPassword) {
      const newError = validateNewPassword(newPassword);
      setErrors(prev => ({ ...prev, newPassword: newError }));
    }
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (message) setMessage("");
    
    if (touched.newPassword) {
      const error = validateNewPassword(value);
      setErrors(prev => ({ ...prev, newPassword: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      oldPassword: validateOldPassword(oldPassword),
      newPassword: validateNewPassword(newPassword),
    };

    setErrors(newErrors);
    setTouched({
      oldPassword: true,
      newPassword: true,
    });

    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleReset = async () => {
    if (!validateForm()) {
      setMessage("Please fix the errors before submitting");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await resetPassword({ oldPassword, newPassword });

      setMessage("Password updated successfully! Redirecting to login...");
      setMsgType("success");

      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
      
    } catch (e: any) {
      setMessage(e?.response?.data?.message || "Password reset failed. Please check your current password.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
    if (!password) return { strength: "", color: "", width: "0%" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    if (score <= 2) return { strength: "Weak", color: "bg-red-500", width: "33%" };
    if (score <= 4) return { strength: "Medium", color: "bg-yellow-500", width: "66%" };
    return { strength: "Strong", color: "bg-green-500", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1729] to-[#0a0e1a] p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group mx-auto"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-gray-400">Update your password to keep your account secure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Change Password</h2>
              </div>

              <div className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={oldPassword}
                      onChange={(e) => handleOldPasswordChange(e.target.value)}
                      onBlur={() => handleBlur("oldPassword")}
                      className={`w-full px-4 py-3 pr-12 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                        touched.oldPassword && errors.oldPassword 
                          ? "border-red-500" 
                          : "border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showOldPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {touched.oldPassword && <ErrorMessage error={errors.oldPassword} />}
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      onBlur={() => handleBlur("newPassword")}
                      className={`w-full px-4 py-3 pr-12 bg-[#0f1729] border rounded-xl outline-none text-white placeholder-gray-500 transition-all ${
                        touched.newPassword && errors.newPassword 
                          ? "border-red-500" 
                          : "border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && !errors.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Password Strength</span>
                        <span className={`text-xs font-semibold ${
                          passwordStrength.strength === "Strong" ? "text-green-400" :
                          passwordStrength.strength === "Medium" ? "text-yellow-400" :
                          "text-red-400"
                        }`}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: passwordStrength.width }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {touched.newPassword && <ErrorMessage error={errors.newPassword} />}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button 
                    onClick={handleReset}
                    disabled={loading}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Reset Password
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className="sm:w-auto px-6 py-4 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-all border border-gray-700"
                  >
                    Cancel
                  </button>
                </div>

                {/* Status Message */}
                {message && (
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
                      {message}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Security Tips Card */}
            <div className="bg-[#1a2332] rounded-2xl border border-gray-800 p-5 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-blue-400">Security Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Use at least 8 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Mix uppercase & lowercase letters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Include numbers & special characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Avoid common words or patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Don't reuse old passwords</span>
                </li>
              </ul>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-yellow-400">Important</h3>
              </div>
              <p className="text-yellow-300 text-sm leading-relaxed">
                After resetting your password, you'll be logged out and redirected to the login page. Please use your new password to sign in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}