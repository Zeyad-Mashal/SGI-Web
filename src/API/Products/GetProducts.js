const URL = "https://sgi-dy1p.onrender.com/api/v1/product/get?page=1";
const GetProducts = async (setAllProducts, setError, setLoading) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': "en"
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
export default GetProducts;