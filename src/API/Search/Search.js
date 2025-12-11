const URL = "https://sgi-dy1p.onrender.com/api/v1/product/search?q=";
const Search = async (setSearchedProducts, setError, setLoading, searchValue) => {
    setLoading(true)
    try {
        const response = await fetch(`${URL}${searchValue}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': "en"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setSearchedProducts(result.products)
            setLoading(false)

        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);

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
export default Search;