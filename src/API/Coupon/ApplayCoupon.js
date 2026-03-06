const URL = "https://sgi-dy1p.onrender.com/api/v1/coupon/apply";
const ApplayCoupon = async (coupon, setError, setLoading, setDiscount) => {
    setLoading(true)
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coupon })
        });

        const result = await response.json();

        if (response.ok) {
            setDiscount(result.discount);
            setLoading(false);
            return result;
        } else {
            const message = result?.message || "An error occurred";
            setError(message);
            setLoading(false);
            return { success: false, message };
        }
    } catch (error) {
        const message = "An error occurred";
        setError(message);
        setLoading(false);
        return { success: false, message };
    }
}
export default ApplayCoupon;