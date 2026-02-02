const URL = "https://sgi-dy1p.onrender.com/api/v1/product/get";
const GetProductsByBrand = async (setProductsByBrand, setError, setLoading, brandId, page = 1, setPagination) => {
    setLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const response = await fetch(`${URL}?brand=${brandId}&page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang || "en"
            },
        });

        const result = await response.json();

        if (response.ok) {
            // تأكد من أن products هو array حتى لو كان null أو undefined
            const products = Array.isArray(result.products) ? result.products : [];
            setProductsByBrand(products)

            if (setPagination) {
                // Handle pagination data   
                let paginationData = {
                    currentPage: page,
                    totalPages: 1,
                    totalProducts: 0
                };

                if (result.pagination) {
                    paginationData = {
                        currentPage: result.pagination.currentPage || result.pagination.page || page,
                        totalPages: result.pagination.totalPages || result.pagination.pages || 1,
                        totalProducts: result.pagination.totalProducts || result.pagination.total || result.pagination.count || 0
                    };
                } else {
                    paginationData = {
                        currentPage: result.currentPage || result.page || page,
                        totalPages: result.totalPages || result.pages || 1,
                        totalProducts: result.totalProducts || result.total || result.count || (result.products ? result.products.length : 0)
                    };
                }

                setPagination(paginationData);
            }

            setLoading(false)
        } else {
            if (response.status == 400) {
                setError(result.message);
                setLoading(false)

            } else if (response.status == 404) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);

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
export default GetProductsByBrand;