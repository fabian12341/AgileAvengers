import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const useLogin = () => {
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return false;
    }

    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
      setError("API configuration is missing");
      setLoading(false);
      return false;
    }

    console.log("Login request:", { email, password }); // Debug log
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL); // Debug log
    console.log("API Key:", process.env.NEXT_PUBLIC_API_KEY); // Debug log

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData); // Debug log
        setError(errorData.error || "Invalid email or password 1");
        setLoading(false);
        return false;
      }

      const data = await response.json();
      console.log("Login response:", data); // Debug log

      if (!data.user || !data.user.email || !data.user.id) {
        setError("Invalid email or password 2");
        setLoading(false);
        return false;
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.name || "Usuario Desconocido",
        email: data.user.email,
        role: data.user.role || "admin",
      };

      setUser(userData);
      console.log("Set user in context:", userData); // Debug log

      setLoading(false);
      return true;
    } catch (err) {
      console.log("Fetch error:", err); // Debug log
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return { error, loading, login, logout };
};
