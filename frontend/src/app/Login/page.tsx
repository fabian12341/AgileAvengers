"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { useLogin } from "../hooks/useLogin"; // Import the custom hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(""); // State for validation errors
  const { login, error, loading } = useLogin(); // Use the hook
  const router = useRouter();

  const handleLogin = async () => {
    // Validate input fields
    if (!email || !password) {
      setFormError("Email and password are required."); // Set error if fields are empty
      return;
    }
  
    setFormError(""); // Clear form error if validation passes
  
    try {
      // Attempt to log in with the provided credentials
      await login(email, password);
  
      // Check if there was an error during login
      if (error) {
        setFormError("Invalid email or password. Please try again.");
        return;
      }
  
      // If login is successful, redirect to the Home page
      router.push("/Home");
    } catch (err) {
      // If login fails, display an error message
      setFormError("An unexpected error occurred. Please try again.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-gray-800 shadow-lg">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">
          NEORIS
        </h1>
        {/* Display form validation error */}
        {formError && (
          <div className="text-red-500 text-sm mb-4 text-center">{formError}</div>
        )}
        {/* Display login error */}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="text-gray-400 text-sm">Email</label>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-1">
            <span className="text-gray-400">
              <FaUser size={20} />
            </span>
            <input
              type="text"
              className="bg-transparent border-none outline-none text-white w-full ml-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-gray-400 text-sm">Password</label>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-1">
            <span className="text-gray-400">
              <FaLock size={20} />
            </span>
            <input
              type="password"
              className="bg-transparent border-none outline-none text-white w-full ml-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
        </div>
        <div className="text-right mb-4">
          <a href="#" className="text-purple-400 text-sm">
            Forgot password?
          </a>
        </div>
        <button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          onClick={handleLogin}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}