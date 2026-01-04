const URL = "https://sgi-dy1p.onrender.com/api/v1/address/get/";
const GetAddress = async (setAddresses, setError, setLoading) => {
    setLoading(true)
    
    // Get userId from token
    let id = null;
    try {
        const token = localStorage.getItem("sgitoken");
        if (token) {
            const payload = token.split('.')[1];
            if (payload) {
                const decodedPayload = JSON.parse(atob(payload));
                id = decodedPayload.id || null;
            }
        }
    } catch (error) {
        console.error("Error decoding token:", error);
    }
    
    if (!id) {
        setError("User ID not found");
        setLoading(false);
        return;
    }
    
    try {
        const response = await fetch(`${URL}${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok) {
            setAddresses(result.addresses)
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
export default GetAddress;