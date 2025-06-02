"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetNewPassword() {
  const [newPassword, setNewPasswordInput] = useState("");
  const [confirmPassword, setConfirmPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSetPassword = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const email = localStorage.getItem("recoveryEmail"); // Retrieve email from localStorage

    if (!email) {
      setError("Email is missing. Please restart the recovery process.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
      setError("API configuration is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/set-new-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
          body: JSON.stringify({
            receiver_email: email,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password updated successfully.");
        setTimeout(() => {
          router.push(`/Home?email=${encodeURIComponent(email)}`); // Redirect to Home page after success
        }, 2000); // Delay for showing the success message
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl bg-gray-800 shadow-lg">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">
          Set New Password
        </h1>

        {message && (
          <div className="text-green-500 text-sm mb-4 text-center">{message}</div>
        )}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <div className="mb-4">
          <label className="text-gray-400 text-sm">New Password</label>
          <input
            type="password"
            className="bg-gray-700 p-2 rounded-lg mt-1 text-white w-full"
            value={newPassword}
            onChange={(e) => setNewPasswordInput(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-400 text-sm">Confirm Password</label>
          <input
            type="password"
            className="bg-gray-700 p-2 rounded-lg mt-1 text-white w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
            placeholder="Confirm your new password"
          />
        </div>

        <button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          onClick={handleSetPassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Set Password"}
        </button>
      </div>
    </div>
  );
}