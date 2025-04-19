"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      setFormError("Please enter your email.");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      // Simular petición (reemplaza con llamada real a tu API)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage(
        "If the email is registered, you'll receive a recovery link."
      );
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-gray-800 shadow-lg">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">
          Forgot Password
        </h1>

        {formError && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="text-green-500 text-sm mb-4 text-center">
            {successMessage}
          </div>
        )}

        <div className="mb-4">
          <label className="text-gray-400 text-sm">Email</label>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-1">
            <span className="text-gray-400">
              <FaEnvelope size={20} />
            </span>
            <input
              type="email"
              className="bg-transparent border-none outline-none text-white w-full ml-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Recovery Email"}
        </button>

        <div className="text-center mt-4">
          <a
            onClick={() => router.push("/Login")}
            className="text-purple-400 text-sm cursor-pointer hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
