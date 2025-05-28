import { useState, useEffect } from "react";

export const useVerification = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("recoveryEmail");
      console.log("Retrieved email from localStorage:", savedEmail);
      setEmail(savedEmail);
    }
  }, []);

  const verify = async (code: string): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Email is missing");
      setLoading(false);
      return { success: false };
    }

    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
      setError("API configuration is missing");
      setLoading(false);
      return { success: false };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ receiver_email: email, code }),
      });

      const rawText = await response.text();
      console.log("Raw response text:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        setError("Invalid JSON returned from server.");
        setLoading(false);
        return { success: false };
      }

      if (!response.ok) {
        console.log("Response body (error):", data);
        setError(data.message || "Verification failed");
        setLoading(false);
        return { success: false };
      }

      
      setMessage("Verification successful");
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setMessage(null);
      setLoading(false);
      return { success: false };
    }
  };

  return { message, error, loading, verify };
};