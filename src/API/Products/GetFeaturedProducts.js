const URL = "https://sgi-dy1p.onrender.com/api/v1/product/get?page=1&type=featured ";
const GetFeaturedProducts = async (setAllProducts, setError, setLoading) => {
    setLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang
            },
        });

        const result = await response.json();

        if (response.ok) {
            setAllProducts(result.products)
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
export default GetFeaturedProducts;