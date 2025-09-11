import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // for success message
  const [showReset, setShowReset] = useState(false); // toggle reset input
  const [resetEmail, setResetEmail] = useState(""); // email for password reset
  const navigate = useNavigate();
  const auth = getAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handlePasswordReset = async () => {
    if (!emailRegex.test(resetEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Password reset email sent. Please check your inbox.");
      setError("");
      setShowReset(false);
    } catch (err) {
      setError("Error sending password reset email.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 dark:text-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded mb-4"
          onChange={handleChange}
          value={form.email}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded mb-2"
          onChange={handleChange}
          value={form.password}
          required
        />

        {/* Forgot Password link */}
        <div className="mb-4 text-right text-sm">
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
          Login
        </button>

        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 text-center">
          New User?{" "}
          <a
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Signup
          </a>
        </p>

        {/* Show password reset input */}
        {showReset && (
          <div className="mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded mb-2"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value);
                setError("");
                setMessage("");
              }}
            />
            <button
              type="button"
              onClick={handlePasswordReset}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Send Reset Link
            </button>
          </div>
        )}

        {/* Show error or success messages */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
