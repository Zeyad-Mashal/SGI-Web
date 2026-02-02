const URL = "https://sgi-dy1p.onrender.com/api/v1/auth/register";
const Register = async (formData, setError, setLoading, onSuccess) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                // Don't set Content-Type for FormData, browser will set it automatically with boundary
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            // localStorage.setItem('user', JSON.stringify(result.user));
            if (onSuccess) {
                onSuccess();
            }
            return { success: true, data: result };
        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)

            } else if (response.status == 403) {
                setError(result.message);
                setLoading(false)
            } else {
                setError(result.message);
                setLoading(false)
            }
            return { success: false, error: result.message };
        }
    } catch (error) {
        const lang = localStorage.getItem("lang") || "en";
        const errorMessage = lang === "ar" ? "حدث خطأ" : "An error occurred";
        setError(errorMessage);
        setLoading(false)
        return { success: false, error: errorMessage };
    }
}
export default Register;