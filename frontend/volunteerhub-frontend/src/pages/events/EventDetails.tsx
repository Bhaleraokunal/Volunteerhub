import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../../api/registration.api";
import { getEvent } from "../../api/event.api";
import {
  registerEvent,
  unregisterEvent,
  checkIn,
  submitFeedback,
  getMyRegistrations
} from "../../api/registration.api";

import { useAuth } from "../../auth/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type PieLabelRenderProps
} from "recharts";

export default function EventDetails() {
  const { user } = useAuth();
  const { eventId } = useParams();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number>(0);

  /* ---------------- EVENT DETAILS ---------------- */
  const {
    data: eventRes,
    isLoading,
    refetch: refetchEvent
  } = useQuery({
    queryKey: ["event-details", eventId],
    queryFn: () => getEvent(Number(eventId)),
    enabled: !!eventId
  });

  /* ---------------- MY REGISTRATIONS (SOURCE OF TRUTH) ---------------- */
  const {
    data: myRegsRes,
    refetch: refetchMyRegs
  } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: getMyRegistrations,
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 font-semibold text-lg">Loading event details…</p>
          <p className="text-gray-500 text-sm">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const event = eventRes?.data?.data;

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-xl font-bold text-red-600">Event not found</p>
          <p className="text-gray-600 mt-2">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const registered = event?.registeredCount ?? 0;
  const total = event?.maxAllowedRegistrations ?? 0;
  const available = Math.max(total - registered, 0);

  const pieData =
    total > 0
      ? [
          { name: "Registered Volunteers", value: registered },
          { name: "Remaining Slots", value: available }
        ]
      : [];

  const COLORS = ["#2563eb", "#a5b4fc"];

  /* ---------------- DERIVE STATE CORRECTLY ---------------- */
  const myRegistrations = myRegsRes?.data?.data || [];

  const myEventReg = myRegistrations.find(
    (r: any) => r.eventId === event.eventId
  );

  const isRegistered = !!myEventReg;
  const hasCheckedIn = myEventReg?.checkIn === true;
  const hasFeedback = myEventReg?.rating != null;

  /* ---------------- ACTION HANDLERS ---------------- */
  const sync = async () => {
    await Promise.all([refetchEvent(), refetchMyRegs()]);
  };

  // STEP 2: handlePayment is a top-level const, same level as handleRegister
  const handlePayment = async (eventId: number) => {
    try {
      const email = user?.emailId;

      const { data } = await createOrder(eventId, email!);
      const order = typeof data === "string" ? JSON.parse(data) : data;

      const options = {
        key: "rzp_test_SSzsBN4sk0e0bj",
        amount: order.amount,
        currency: order.currency,
        name: "VolunteerHub",
        description: "Event Payment",
        order_id: order.id || order.orderId,

        handler: async function (response: any) {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          setMessage("✅ Payment Successful!");
          await sync();
        },

        prefill: {
          email: email
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setMessage("❌ Payment failed");
    }
  };

  // STEP 3: handleRegister is clean — no nested handlePayment inside
  const handleRegister = async () => {
    if (isRegistered) return;

    try {
      setLoading(true);
      await registerEvent(event.eventId);

      await queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      await queryClient.invalidateQueries({ queryKey: ["event-details", eventId] });

      setMessage("Registered successfully");
    } catch {
      setMessage("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isRegistered || hasCheckedIn) return;

    try {
      setLoading(true);
      await unregisterEvent(event.eventId);

      await queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      await queryClient.invalidateQueries({ queryKey: ["event-details", eventId] });

      setMessage("Unregistered successfully");
    } catch {
      setMessage("Unregister failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!isRegistered || hasCheckedIn) return;

    try {
      setLoading(true);
      await checkIn(event.eventId);

      await queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      await queryClient.invalidateQueries({ queryKey: ["event-details", eventId] });

      setMessage("Check-in successful");
    } catch {
      setMessage("Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async () => {
    if (!isRegistered || !hasCheckedIn || hasFeedback) return;

    try {
      setLoading(true);
      await submitFeedback(event.eventId, rating);

      await queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
      await queryClient.invalidateQueries({ queryKey: ["event-details", eventId] });

      setMessage("Feedback submitted");
    } catch {
      setMessage("Feedback failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: The stub `function handlePayment(eventId: any) { throw new Error(...) }` is REMOVED

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* EVENT HEADER */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform hover:shadow-2xl transition-shadow duration-300">
          <div className="h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight">{event.eventName}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 ml-4 flex-shrink-0">
                Open
              </span>
            </div>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">{event.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-4">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-800">{event.city}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{event.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-purple-50 rounded-lg p-4">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">Duration</p>
                  <p className="text-sm font-medium text-gray-800">{event.eventStartDate}</p>
                  <p className="text-xs text-gray-600 mt-0.5">to {event.eventEndDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PARTICIPATION CHART */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Event Participation Overview
          </h3>

          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const percent = props.percent ?? 0;
                    return `${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Registered</p>
              <p className="text-2xl font-bold text-blue-700">{registered}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-indigo-700">{available}</p>
            </div>
          </div>
        </div>

        {/* NOT LOGGED IN — SHOW ACCESS DENIED */}
        {!user && (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-red-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You must be logged in as a volunteer to register for this event.
            </p>
            <button
              onClick={() => window.location.href = "/login"}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* VOLUNTEER ACTIONS */}
        {user && user.userRole === "VOLUNTEER" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Volunteer Actions
              </h2>
              <p className="text-blue-100 mt-2 text-sm">Manage your participation in this event</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">

              {/* Progress Tracker */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isRegistered ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isRegistered ? '✓' : '1'}
                  </div>
                  <p className="text-xs mt-2 text-center font-semibold text-gray-700">Register</p>
                </div>
                <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-300 ${isRegistered ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    hasCheckedIn ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {hasCheckedIn ? '✓' : '2'}
                  </div>
                  <p className="text-xs mt-2 text-center font-semibold text-gray-700">Check-in</p>
                </div>
                <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-300 ${hasCheckedIn ? 'bg-green-500' : 'bg-gray-200'}`}></div>

                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    hasFeedback ? 'bg-green-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {hasFeedback ? '✓' : '3'}
                  </div>
                  <p className="text-xs mt-2 text-center font-semibold text-gray-700">Feedback</p>
                </div>
              </div>

              {/* REGISTER SECTION */}
              <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow">1</span>
                  Registration
                </h3>

                {!isRegistered ? (
                  <div className="space-y-3">
                    {!event.registrationAllowed && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-3">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-sm font-medium text-red-800">Registration is currently closed</p>
                        </div>
                      </div>
                    )}
                    {/* STEP 4: Button is correct — routes to handlePayment or handleRegister */}
                    <button
                      onClick={() => {
                        if (event.isPaid) {
                          handlePayment(event.eventId);
                        } else {
                          handleRegister();
                        }
                      }}
                      disabled={loading || !event.registrationAllowed}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {loading ? "Processing..." : event.isPaid ? "Pay & Register" : "Register for Event"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold text-green-800">You are registered for this event</p>
                      </div>
                    </div>
                    {!hasCheckedIn && (
                      <button
                        onClick={handleUnregister}
                        disabled={loading}
                        className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {loading ? 'Processing...' : 'Unregister'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* CHECK-IN SECTION */}
              <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-indigo-50 to-purple-50">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow">2</span>
                  Check-in
                </h3>

                {hasCheckedIn ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-semibold text-green-800">You have checked in</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!isRegistered && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-3">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-sm font-medium text-yellow-800">Please register first before checking in</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={handleCheckIn}
                      disabled={loading || !isRegistered || hasCheckedIn}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (hasCheckedIn ? "Checked In" : "Check In Now")}
                    </button>
                  </div>
                )}
              </div>

              {/* FEEDBACK SECTION */}
              <div className="border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-pink-50">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow">3</span>
                  Feedback
                </h3>

                {hasFeedback ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-semibold text-green-800">Thank you for your feedback!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(!isRegistered || !hasCheckedIn) && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="text-sm font-medium text-yellow-800">
                            {!isRegistered ? 'Register and check in before submitting feedback' : 'Check in to the event before submitting feedback'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Rate your experience (1-5 stars)
                      </label>
                      <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            disabled={!hasCheckedIn}
                            className={`w-12 h-12 transition-all duration-200 transform hover:scale-110 ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            } ${!hasCheckedIn ? 'cursor-not-allowed opacity-50' : 'hover:text-yellow-400 cursor-pointer'}`}
                          >
                            <svg className="w-full h-full fill-current drop-shadow-md" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          </button>
                        ))}
                        <span className="ml-2 text-gray-700 font-semibold">{rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'No rating'}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleFeedback}
                      disabled={loading || hasFeedback || !hasCheckedIn}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </span>
                      ) : 'Submit Feedback'}
                    </button>
                  </div>
                )}
              </div>

              {/* MESSAGE DISPLAY */}
              {message && (
                <div className={`rounded-xl p-4 border-l-4 animate-fade-in ${
                  message.includes('✅') ? 'bg-green-50 border-green-500 text-green-800' :
                  message.includes('❌') ? 'bg-red-50 border-red-500 text-red-800' :
                  'bg-yellow-50 border-yellow-500 text-yellow-800'
                }`}>
                  <p className="font-semibold flex items-center gap-2">
                    {message.includes('✅') ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : message.includes('❌') ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    {message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}