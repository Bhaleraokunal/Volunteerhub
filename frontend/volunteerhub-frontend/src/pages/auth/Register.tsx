import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/user.api";

/**
 * Allowed roles – MUST match backend enum exactly
 */
type UserRole = "VOLUNTEER" | "ORGANIZER";

interface RegisterForm {
  emailId: string;
  password: string;
  address: string;
  phoneNumber: string;
  userRole: UserRole;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    emailId: "",
    password: "",
    address: "",
    phoneNumber: "",
    userRole: "VOLUNTEER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handle input & select changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "userRole"
          ? (value as UserRole)
          : value,
    }));
  };

  /**
   * Submit registration form
   */
  const submit = async () => {
    // Basic validation
    if (
      !form.emailId ||
      !form.password ||
      !form.phoneNumber ||
      !form.address
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser(form);

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h1>

        <div className="space-y-4">
          <input
            name="emailId"
            type="email"
            placeholder="Email"
            value={form.emailId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />

          <input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />

          <input
            name="address"
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />

          <select
            name="userRole"
            value={form.userRole}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="VOLUNTEER">Volunteer</option>
            <option value="ORGANIZER">Organizer</option>
          </select>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
