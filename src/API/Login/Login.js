const URL = "https://sgi-dy1p.onrender.com/api/v1/auth/login";
const Login = async (data, setError, setLoading) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            localStorage.setItem('sgitoken', result.token);
            localStorage.setItem('userId', result.id);
            return window.location.href = "/";
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
        const lang = localStorage.getItem("lang") || "en";
        const errorMessage = lang === "ar" ? "حدث خطأ" : "An error occurred";
        setError(errorMessage);
        setLoading(false)
    }
}
export default Login;