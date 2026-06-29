import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navbar */}
      <header className="relative max-w-7xl mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-105 transform transition-all duration-200">
            VolunteerHub
          </h1>
        </div>

        <div className="space-x-4">
  <button
    onClick={() => handleNavigate("/login")}
    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
  >
    Login
  </button>

  <button
    onClick={() => handleNavigate("/register")}
    className="px-6 py-2.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium"
  >
    Register
  </button>
</div>

      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-2 animate-bounce-slow">
              🎯 Join the Movement
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              Make a Difference.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">
                One Event at a Time.
              </span>
            </h2>
          </div>

          <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
            VolunteerHub connects passionate volunteers with meaningful
            community events. Discover opportunities, participate,
            and create real impact together.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => handleNavigate("/login")}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>

            <button
              onClick={() => handleNavigate("/events")}
              className="group px-8 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold text-lg text-gray-700 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Events
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Interactive Stats Section with Enhanced Hover */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer border border-blue-100"
              onMouseEnter={() => setHoveredStat(1)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`text-4xl font-bold text-blue-600 mb-2 ${hoveredStat === 1 ? 'animate-bounce' : ''}`}>10+</div>
              <div className="text-sm text-gray-600 font-medium">Events</div>
              <div className={`text-3xl mt-2 transition-all duration-300 ${hoveredStat === 1 ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}>🎪</div>
            </div>
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer border border-indigo-100"
              onMouseEnter={() => setHoveredStat(2)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`text-4xl font-bold text-indigo-600 mb-2 ${hoveredStat === 2 ? 'animate-bounce' : ''}`}>10+</div>
              <div className="text-sm text-gray-600 font-medium">Volunteers</div>
              <div className={`text-3xl mt-2 transition-all duration-300 ${hoveredStat === 2 ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}>👥</div>
            </div>
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 cursor-pointer border border-purple-100"
              onMouseEnter={() => setHoveredStat(3)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`text-4xl font-bold text-purple-600 mb-2 ${hoveredStat === 3 ? 'animate-bounce' : ''}`}>2+</div>
              <div className="text-sm text-gray-600 font-medium">Cities</div>
              <div className={`text-3xl mt-2 transition-all duration-300 ${hoveredStat === 3 ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`}>🌆</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-6 pt-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white"></div>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">Join 5000+ volunteers</span>
            </div>
          </div>
        </div>

        {/* Right Visual - Enhanced Interactive Card */}
        <div className="hidden md:flex justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md transform hover:scale-105 transition-all duration-300 border-2 border-gray-100 relative overflow-hidden group">
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg animate-pulse-slow">
                  V
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Why VolunteerHub?
                </h3>
              </div>

              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-gray-700 group/item transform hover:translate-x-2 transition-all duration-200">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center text-sm font-bold group-hover/item:bg-gradient-to-br group-hover/item:from-blue-600 group-hover/item:to-blue-700 group-hover/item:text-white transition-all group-hover/item:rotate-12 group-hover/item:scale-110 shadow-sm">✓</span>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover/item:text-blue-600 transition-colors">Discover nearby events</div>
                    <div className="text-sm text-gray-500 mt-1">Find opportunities in your community</div>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-700 group/item transform hover:translate-x-2 transition-all duration-200">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold group-hover/item:bg-gradient-to-br group-hover/item:from-indigo-600 group-hover/item:to-indigo-700 group-hover/item:text-white transition-all group-hover/item:rotate-12 group-hover/item:scale-110 shadow-sm">✓</span>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover/item:text-indigo-600 transition-colors">Easy registration</div>
                    <div className="text-sm text-gray-500 mt-1">Sign up and check-in with ease</div>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-700 group/item transform hover:translate-x-2 transition-all duration-200">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-xl flex items-center justify-center text-sm font-bold group-hover/item:bg-gradient-to-br group-hover/item:from-purple-600 group-hover/item:to-purple-700 group-hover/item:text-white transition-all group-hover/item:rotate-12 group-hover/item:scale-110 shadow-sm">✓</span>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover/item:text-purple-600 transition-colors">Track your impact</div>
                    <div className="text-sm text-gray-500 mt-1">Monitor your volunteering journey</div>
                  </div>
                </li>
                <li className="flex items-start gap-4 text-gray-700 group/item transform hover:translate-x-2 transition-all duration-200">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center text-sm font-bold group-hover/item:bg-gradient-to-br group-hover/item:from-blue-600 group-hover/item:to-blue-700 group-hover/item:text-white transition-all group-hover/item:rotate-12 group-hover/item:scale-110 shadow-sm">✓</span>
                  <div>
                    <div className="font-semibold text-gray-800 group-hover/item:text-blue-600 transition-colors">For everyone</div>
                    <div className="text-sm text-gray-500 mt-1">Built for volunteers & organizers</div>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">Trusted by communities</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="w-5 h-5 text-yellow-400 fill-current transform hover:scale-125 transition-transform cursor-pointer" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h3>
          <p className="text-gray-600 text-lg">Get started in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">1</div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">Sign Up</h4>
            <p className="text-gray-600">Create your account and set up your profile in minutes</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-indigo-100">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">2</div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">Find Events</h4>
            <p className="text-gray-600">Browse and discover volunteering opportunities near you</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">3</div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">Make Impact</h4>
            <p className="text-gray-600">Participate and track your contribution to the community</p>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button 
          className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-2xl hover:shadow-pink-500/50 flex items-center justify-center text-3xl transform hover:scale-110 hover:rotate-12 transition-all duration-300 animate-bounce-slow"
          title="Chat with us"
        >
          💬
        </button>
        <button 
          className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-2xl hover:shadow-green-500/50 flex items-center justify-center text-3xl transform hover:scale-110 hover:rotate-12 transition-all duration-300 animate-bounce-slow" 
          style={{ animationDelay: '0.5s' }}
          title="Contact us"
        >
          📧
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}