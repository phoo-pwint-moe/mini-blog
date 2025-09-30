import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from '../api';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.post(`/user/register`, {
        username,
        password,
      });

      if (response.data.message) {
        setError(response.data.message);
        return;
      } else {
        alert("Register successfully! Please login.");
        navigate("/login"); // redirect to login
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white from-sky-600 via-indigo-700 to-purple-700 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 flex items-center justify-center">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md"
          aria-labelledby="register-heading"
        >
          <h2
            id="register-heading"
            className="text-2xl font-bold text-gray-900"
          >
            Create your account
          </h2>

          <label className="block mt-6 text-sm font-medium text-gray-700">
            Username
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="Your username"
              aria-label="username"
            />
          </label>

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="••••••••"
              aria-label="password"
            />
          </label>

          <label className="block mt-4 text-sm font-medium text-gray-700">
            Password
            <input
              type="password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              placeholder="••••••••"
              aria-label="confirmPassword"
            />
          </label>

          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mt-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-indigo-400 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L15 4V0a12 12 0 00-11 12h-0z"
                />
              </svg>
            )}
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/login`}
              className="mt-4 text-indigo-600 hover:underline text-sm"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;