import { useState } from "react";

export const useSetNewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setNewPassword = async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean }> => {
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!email || !newPassword) {
      setError("Email or password is missing");
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
        `${process.env.NEXT_PUBLIC_API_URL}/set-new-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
          body: JSON.stringify({ receiver_email: email, new_password: newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password updated successfully");
        return { success: true };
      } else {
        setError(data.error || "Failed to update password");
        return { success: false };
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { setNewPassword, loading, message, error };
};