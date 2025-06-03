"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";
import { useLogin } from "../hooks/useLogin";
import Image from "next/image";
import myLogo from "../components/ui/assets/LOGOSHIELDAI.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, error, loading } = useLogin();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    setFormError("");

    try {
      const result = await login(email, password);

      if (!result.success) {
        setFormError("Login failed. Please check your credentials.");
        return;
      }

      if (!result.user) {
        setFormError("Login failed. User data is missing.");
        return;
      }
      const { name, role, id_team, id } = result.user;
      if (result.success) {
        // Guardar datos de usuario en localStorage
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ name, role, id_team, id })
        );
        router.push(
          `/Home?name=${encodeURIComponent(
            name
          )}&role=${role}&id_team=${id_team}&id=${id}`
        );
      }
    } catch (err) {
      setFormError("An unexpected error occurred. Please try again.");
      console.error("Login failed:", err);
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
          <a
            onClick={() => router.push("/ForgPwd")}
            className="text-purple-400 text-sm cursor-pointer hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
