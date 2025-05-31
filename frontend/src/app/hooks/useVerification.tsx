import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useVerification = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("recoveryEmail");
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
          body: JSON.stringify({ receiver_email: email, code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed");
        setLoading(false);
        return { success: false };
      }

      setMessage("Verification successful");
      setLoading(false);

      // Redirect to "Set New Password" page
      router.push("/SetNewPassword");

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