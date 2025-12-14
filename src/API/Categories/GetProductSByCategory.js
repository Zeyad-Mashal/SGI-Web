const URL = "https://sgi-dy1p.onrender.com/api/v1/product/get?page=1&category=";
const GetProductSByCategory = async (setProductsByCategory, setError, setLoading, id) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': "en"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setProductsByCategory(result.products)
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
                console.log(result.message);
            }
        }
    } catch (error) {
        setError('An error occurred');
        setLoading(false)
    }
}
export default GetProductSByCategory;