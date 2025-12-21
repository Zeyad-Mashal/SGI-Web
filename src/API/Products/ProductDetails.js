const URL = "https://sgi-dy1p.onrender.com/api/v1/product/details/";
const ProductDetails = async (setProductDetails, setError, setLoading, id) => {
    setLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang
            },
        });

        const result = await response.json();

        if (response.ok) {
            setProductDetails(result.product)
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
export default ProductDetails;