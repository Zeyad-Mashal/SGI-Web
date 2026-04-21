const URL = "https://sgi-dy1p.onrender.com/api/v1/payment/create";
const CreatePayment = async (data, setError, setLoading) => {
    setLoading(true)
    const amountNum =
        typeof data?.amount === "number"
            ? data.amount
            : parseFloat(data?.amount);
    const amount =
        Number.isFinite(amountNum) && amountNum > 0
            ? Math.ceil(amountNum)
            : undefined;
    const body = { amount };
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (response.ok) {
            setLoading(false);
            return result;
        } else {
            if (response.status == 400) {
                setError(result.message || "Invalid payment request data.");
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
export default CreatePayment;