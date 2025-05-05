// src/app/hooks/useLogin.ts
import { useState } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  id_team: number;
}

export const useLogin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User }> => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return { success: false };
    }

    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
      setError("API configuration is missing");
      setLoading(false);
      return { success: false };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Invalid email or password");
        setLoading(false);
        return { success: false };
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setUser(null);
      setLoading(false);
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return { user, error, loading, login, logout };
};
