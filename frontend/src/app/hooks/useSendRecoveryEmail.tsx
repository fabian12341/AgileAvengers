import { useState } from "react";

export const useSendRecoveryEmail = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendEmail = async (email: string): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return { success: false };
    }
    localStorage.setItem("recoveryEmail", email);

    if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
      setError("API configuration missing");
      setLoading(false);
      return { success: false };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ receiver_email: email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Response body (error):", errorData);
        setError(errorData.error || "Failed to send recovery email");
        setLoading(false);
        return { success: false };
      }

      const data = await response.json();
      setMessage(data.message || "Recovery email sent successfully!");
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setMessage(null);
      setLoading(false);
      return { success: false };
    }
  };

  return { message, error, loading, sendEmail };
};