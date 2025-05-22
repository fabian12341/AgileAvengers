import { useState } from "react";

export const useVerification = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Verification failed");
      }

      if (!result.user) {
        throw new Error("User data is missing");
      }

      return { success: true, user: result.user };
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { verify, error, loading };
};