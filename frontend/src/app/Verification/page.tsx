"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaKey } from "react-icons/fa";
import { useVerification } from "../hooks/useVerification";
import Image from "next/image";
import myLogo from "../components/ui/assets/LOGOSHIELDAI.png";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const { verify, loading, error, message } = useVerification();
  const router = useRouter();

  const handleVerify = async () => {
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      setFormError("Please enter a valid 6-digit code.");
      return;
    }

    setFormError("");

    const success = await verify(code);

    if (!success) {
      setFormError("Verification failed. Please check your code.");
      return;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-gray-800 shadow-lg">
        <div className="flex justify-center mb-4">
          <Image src={myLogo} alt="Shield-AI Logo" width={250} height={80} />
        </div>

        {formError && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {formError}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        {message && (
          <div className="text-green-500 text-sm mb-4 text-center">
            {message}
          </div>
        )}

        <div className="mb-4">
          <label className="text-gray-400 text-sm">Verification Code</label>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-1">
            <span className="text-gray-400">
              <FaKey size={20} />
            </span>
            <input
              type="text"
              className="bg-transparent border-none outline-none text-white w-full ml-2"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(value);
              }}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
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
