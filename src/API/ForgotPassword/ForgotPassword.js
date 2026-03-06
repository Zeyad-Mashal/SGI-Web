const BASE_URL = "https://sgi-dy1p.onrender.com/api/v1/auth";

/**
 * Send 6-digit verification code to email
 */
export const sendForgotPasswordCode = async (email, setError, setLoading) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();

    if (response.ok) {
      setLoading(false);
      return { success: true };
    }
    setError(result.message || "Failed to send code");
    setLoading(false);
    return { success: false };
  } catch (error) {
    const lang = localStorage.getItem("lang") || "en";
    const msg = lang === "ar" ? "حدث خطأ في الإرسال" : "An error occurred while sending";
    setError(msg);
    setLoading(false);
    return { success: false };
  }
};

/**
 * Verify 6-digit code and reset password
 */
export const verifyForgotPasswordCode = async (
  email,
  code,
  newPassword,
  setError,
  setLoading
) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        code: code.join(""),
        newPassword,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      setLoading(false);
      return { success: true };
    }
    setError(result.message || "Invalid or expired code");
    setLoading(false);
    return { success: false };
  } catch (error) {
    const lang = localStorage.getItem("lang") || "en";
    const msg = lang === "ar" ? "حدث خطأ" : "An error occurred";
    setError(msg);
    setLoading(false);
    return { success: false };
  }
};
