const URL = "https://sgi-dy1p.onrender.com/api/v1/order/create";
const CreateOrder = async (order, setError, setLoading, setDiscount) => {
    setLoading(true)
    const id = localStorage.getItem("userId");
    const finalUrl = id ? `${URL}?merchantId=${id}` : URL;

    // Add userId to order body if it exists
    const orderData = { ...order };
    if (id) {
        orderData.userId = id;
    }

    try {
        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            if (setDiscount && result.discount) {
                setDiscount(result.discount);
            }
            setLoading(false)
            return result;
        } else {
            if (response.status == 404) {
                setError(result.message);
                setLoading(false)
                console.log(result.message);
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
export default CreateOrder;   