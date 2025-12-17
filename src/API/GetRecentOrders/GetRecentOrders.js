const URL = "https://sgi-dy1p.onrender.com/api/v1/order/marchent/get";
const GetRecentOrders = async (setRecentOrders, setError, setLoading) => {
    setLoading(true)
    const token = localStorage.getItem("sgitoken");
    const lang = localStorage.getItem("lang");
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang,
                'Authorization': `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setRecentOrders(result.orders)
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
export default GetRecentOrders;