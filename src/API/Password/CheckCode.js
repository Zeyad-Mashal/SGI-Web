const URL = "https://sgi-dy1p.onrender.com/api/v1/user/merchant/reset/check";

/**
 * التحقق من صحة كود إعادة تعيين كلمة المرور.
 * @param {string} email - الإيميل
 * @param {string} resetPasswordCode - الكود المرسل (5 خانات)
 * @param {function} setError - دالة تعيين رسالة الخطأ
 * @param {function} setLoading - دالة تعيين حالة التحميل
 * @returns {Promise<{ success: boolean }>}
 */
const CheckCode = async (email, resetPasswordCode, setError, setLoading) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, resetPasswordCode }),
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
    setError("An error occurred");
    setLoading(false);
    return { success: false };
  }
};

export default CheckCode;
