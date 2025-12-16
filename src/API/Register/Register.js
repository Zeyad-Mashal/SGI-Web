const URL = "https://sgi-dy1p.onrender.com/api/v1/auth/register";
const Register = async (formData, setError, setLoading) => {
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
            return window.location.href = "/login";
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
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default Register;