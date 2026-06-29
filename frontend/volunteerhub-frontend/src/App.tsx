import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import EventList from "./pages/events/EventList";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import EventDetails from "./pages/events/EventDetails";
import EditEvent from "./pages/organizer/EditEvent";
import EventParticipants from "./pages/organizer/EventParticipants";
import Home from "./pages/Home";
import CreateEvent from "./pages/organizer/CreateEvent";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import MyRegistrations from "./pages/volunteer/MyRegistrations";
import Profile from "./pages/profile/Profile";
import ResetPassword from "./pages/profile/ResetPassword";
import Register from "./pages/auth/Register";

export default function App() {
  return (
    
    <Routes>

      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Volunteer */}
     <Route path="/events" element={<EventList />} />

<Route path="/event/:eventId" element={<EventDetails />} />

      {/* Organizer */}
      <Route
        path="/organizer/dashboard"
        element={
          <ProtectedRoute role="ORGANIZER">
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/create"
        element={
          <ProtectedRoute role="ORGANIZER">
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/edit/:eventId"
        element={
          <ProtectedRoute role="ORGANIZER">
            <EditEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/participants/:eventId"
        element={
          <ProtectedRoute role="ORGANIZER">
            <EventParticipants />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer/registrations/:eventId"
        element={
          <ProtectedRoute role="ORGANIZER">
            <EventParticipants />
          </ProtectedRoute>
        }
      />
      <Route
            path="/volunteer/dashboard"
            element={
              <ProtectedRoute role="VOLUNTEER">
                <VolunteerDashboard />
              </ProtectedRoute>
            }
          />

       <Route
            path="/volunteer/registrations"
            element={
              <ProtectedRoute role="VOLUNTEER">
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
         <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
