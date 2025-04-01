import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="w-96 p-8 rounded-xl bg-gray-800 shadow-lg">
        <h1 className="text-white text-3xl font-semibold mb-6 text-center">NEORIS</h1>
        <div className="mb-4">
          <label className="text-gray-400 text-sm">Username</label>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-1">
            <FaUser  className="text-gray-400" size={20} />

            <input
              type="text"
              className="bg-transparent border-none outline-none text-white w-full ml-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="text-gray-400 text-sm">Password</label>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-1">
          <FaUser className="text-gray-400" size={20} />
            <input
              type="password"
              className="bg-transparent border-none outline-none text-white w-full ml-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="text-right mb-4">
          <a href="#" className="text-purple-400 text-sm">Forgot password?</a>
        </div>
        <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold">
          Login
        </button>
      </div>
    </div>
  );
}
