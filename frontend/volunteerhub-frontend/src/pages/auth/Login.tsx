import { useState } from "react";
import { loginApi } from "../../api/auth.api";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<"VOLUNTEER" | "ORGANIZER">("VOLUNTEER");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // YOUR ORIGINAL SUBMIT FUNCTION - UNCHANGED
  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginApi({ emailId, password });
      const token = res.data.data;

      await login(token);

      // AuthContext updates async, so read from storage
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      if (storedUser.userRole === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else {
        navigate("/volunteer/dashboard");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Modern theme configuration
  const themes = {
    VOLUNTEER: {
      gradient: "from-cyan-500 via-blue-500 to-indigo-600",
      accentGradient: "from-cyan-400 to-blue-500",
      glowColor: "rgba(59, 130, 246, 0.5)",
      icon: "👥",
      label: "Volunteer"
    },
    ORGANIZER: {
      gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
      accentGradient: "from-violet-400 to-fuchsia-500",
      glowColor: "rgba(168, 85, 247, 0.5)",
      icon: "🎯",
      label: "Organizer"
    }
  };

  const theme = themes[selectedRole];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r ${theme.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}></div>
        <div className={`absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r ${theme.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>
        <div className={`absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r ${theme.gradient} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000`}></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Glass card */}
          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Gradient header bar */}
            <div className={`h-2 bg-gradient-to-r ${theme.gradient}`}></div>
            
            <div className="p-8">
              {/* Role switcher - Pill style */}
              <div className="relative bg-white/5 rounded-full p-1.5 mb-8 backdrop-blur-sm border border-white/10">
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-500 shadow-lg`}
                  style={{
                    left: selectedRole === "VOLUNTEER" ? "0.375rem" : "calc(50% + 0.375rem)",
                    boxShadow: `0 4px 20px ${theme.glowColor}`
                  }}
                ></div>
                <div className="relative grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("VOLUNTEER")}
                    className={`py-3 px-4 rounded-full font-medium transition-all duration-300 ${
                      selectedRole === "VOLUNTEER"
                        ? "text-white"
                        : "text-white/60 hover:text-white/80"
                    }`}
                  >
                    <span className="mr-2">👥</span>
                    Volunteer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("ORGANIZER")}
                    className={`py-3 px-4 rounded-full font-medium transition-all duration-300 ${
                      selectedRole === "ORGANIZER"
                        ? "text-white"
                        : "text-white/60 hover:text-white/80"
                    }`}
                  >
                    <span className="mr-2">🎯</span>
                    Organizer
                  </button>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <div 
                  className="inline-block mb-4 text-7xl transform transition-all duration-500 hover:scale-110"
                  style={{
                    filter: `drop-shadow(0 0 20px ${theme.glowColor})`
                  }}
                >
                  {theme.icon}
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-white/60 text-sm">
                  Sign in to continue as{" "}
                  <span className={`font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent`}>
                    {theme.label}
                  </span>
                </p>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${theme.gradient} opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${theme.gradient} opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className={`w-full mt-6 bg-gradient-to-r ${theme.gradient} text-white py-4 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group`}
                  style={{
                    boxShadow: `0 10px 40px ${theme.glowColor}`
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {/* Error Message */}
                {error && (
                  <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-shake">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-300 text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/register")}
                  className="text-sm text-white/60 hover:text-white transition-colors duration-300 group inline-flex items-center"
                >
                  Don't have an account?{" "}
                  <span className={`ml-1 font-semibold bg-gradient-to-r ${theme.accentGradient} bg-clip-text text-transparent group-hover:underline`}>
                    Register
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative bottom text */}
          <div className="text-center mt-6">
            <p className="text-white/30 text-xs">
              Secure login powered by modern encryption
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-2px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}