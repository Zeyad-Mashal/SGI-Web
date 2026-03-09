const URL = "https://sgi-dy1p.onrender.com/api/v1/user/merchant/reset";

/**
 * تغيير كلمة المرور بعد التحقق من الكود.
 * @param {string} email - الإيميل
 * @param {string} password - كلمة المرور الجديدة
 * @param {string} cPassword - تأكيد كلمة المرور
 * @param {function} setError - دالة تعيين رسالة الخطأ
 * @param {function} setLoading - دالة تعيين حالة التحميل
 * @returns {Promise<{ success: boolean }>}
 */
const ChangePassword = async (email, password, cPassword, setError, setLoading) => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, cPassword }),
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            return { success: true };
        }

        setError(result.message || "Failed to reset password");
        setLoading(false);
        return { success: false };
    } catch (error) {
        setError("An error occurred");
        setLoading(false);
        return { success: false };
    }
};

export default ChangePassword;
