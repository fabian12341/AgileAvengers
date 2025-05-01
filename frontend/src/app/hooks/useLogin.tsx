// src/app/hooks/useLogin.ts
import { useState } from "react";

export interface User {
  email: string;
  role: string;
}

export const useLogin = () => {
  const [user, setUser] = useState<User | null>(null);
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
  
    try {
      console.log("Request payload:", { email, password });
      console.log("API Key:", process.env.NEXT_PUBLIC_API_KEY);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Ensure this matches the backend
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Response body (error):", errorData);
        setError(errorData.error || "Invalid email or password");
        setLoading(false);
        return false;
      }
  
      const data = await response.json();
      console.log("Response body (success):", data);
  
      setUser(data.user);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return { user, error, loading, login, logout };
};