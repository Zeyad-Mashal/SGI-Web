const URL = "https://sgi-dy1p.onrender.com/api/v1/category/getAll";
const GetCategories = async (setCategories, setError, setLoading) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-is-dashboard': true
            },
        });

        const result = await response.json();

        if (response.ok) {
            setCategories(result.categories || [])
            setLoading(false)

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
export default GetCategories;