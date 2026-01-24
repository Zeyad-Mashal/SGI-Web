const URL = "https://sgi-dy1p.onrender.com/api/v1/product/get";
const GetProductSByCategory = async (setProductsByCategory, setError, setLoading, id, page = 1, setPagination) => {
    setLoading(true)
    const lang = localStorage.getItem("lang")
    try {
        const response = await fetch(`${URL}?page=${page}&category=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang || "en"
            },
        });

        const result = await response.json();

        if (response.ok) {
            setProductsByCategory(result.products)
            if (setPagination) {
                // Handle different possible pagination response structures
                let paginationData = {
                    currentPage: page,
                    totalPages: 1,
                    totalProducts: 0
                };

                // Check if pagination object exists
                if (result.pagination) {
                    paginationData = {
                        currentPage: result.pagination.currentPage || result.pagination.page || page,
                        totalPages: result.pagination.totalPages || result.pagination.pages || result.pagination.totalPages || 1,
                        totalProducts: result.pagination.totalProducts || result.pagination.total || result.pagination.count || 0
                    };
                } else {
                    // Check for pagination data at root level
                    paginationData = {
                        currentPage: result.currentPage || result.page || page,
                        totalPages: result.totalPages || result.pages || result.totalPages || 1,
                        totalProducts: result.totalProducts || result.total || result.count || (result.products ? result.products.length : 0)
                    };
                }

                console.log('Pagination data:', paginationData);
                console.log('Full API response:', result);
                setPagination(paginationData);
            }
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