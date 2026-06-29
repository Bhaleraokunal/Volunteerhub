import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Props {
  children: JSX.Element;
  role?: "VOLUNTEER" | "ORGANIZER";
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();

  // If you need a loading state, ensure it's implemented in the AuthContext or handle it separately.
  if (!user) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.userRole !== role) {
    return <Navigate to="/" replace />;
  }

  console.log("PROTECTED ROUTE OK");

  // ✅ THIS LINE IS THE FIX
  return children;
}
