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
            setLoading(false)
            return result;
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
export default ApplayCoupon;