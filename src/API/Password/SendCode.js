const URL = "https://sgi-dy1p.onrender.com/api/v1/user/merchant/reset/code";

/**
 * إرسال كود إعادة تعيين كلمة المرور إلى الإيميل.
 * عند النجاح يُرجع { success: true } ليتولى المتصل (مثلاً ClientForgetPassword) الانتقال للاستيب 2 (إدخال الكود).
 * @param {string} email - الإيميل المرسل إليه الكود
 * @param {function} setPasswordError - دالة تعيين رسالة الخطأ
 * @param {function} setPasswordLoading - دالة تعيين حالة التحميل
 * @returns {Promise<{ success: boolean }|undefined>}
 */
const SendCode = async (email, setPasswordError, setPasswordLoading) => {
  setPasswordLoading(true);
  setPasswordError(null);
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      setPasswordLoading(false);
      return { success: true };
    }

    setPasswordError(result.message || "Failed to send code");
    setPasswordLoading(false);
    return { success: false };
  } catch (error) {
    setPasswordError("An error occurred");
    setPasswordLoading(false);
    return { success: false };
  }
};

export default SendCode;