"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope } from "react-icons/fa";
import { useSendRecoveryEmail } from "../hooks/useSendRecoveryEmail";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { sendEmail, loading, error, message } = useSendRecoveryEmail();

  const router = useRouter();

 const handleSubmit = async () => {
  const success = await sendEmail(email);
  if (success) {
    router.push("/Verification");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-gray-800 shadow-lg">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">
          Forgot Password
        </h1>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-500 text-sm mb-4 text-center">
            {message}
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