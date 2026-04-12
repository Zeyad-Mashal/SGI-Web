const BASE_URL = "https://sgi-dy1p.onrender.com/api/v1/payment/result";
/** Query mirrors gateway redirect: ?id=...&resourcePath=... */
const PaymentResult = async ({ id, resourcePath }, setError, setLoading) => {
    setLoading(true)
    const params = new URLSearchParams();
    params.set("id", id);
    params.set("resourcePath", resourcePath);
    const URL = `${BASE_URL}?${params.toString()}`;
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            return result;
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
export default PaymentResult;