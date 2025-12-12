const URL = "https://sgi-dy1p.onrender.com/api/v1/order/create";
const CreatePO = async (formData, setPoError, setPoLoading) => {
    setPoLoading(true)
    const id = localStorage.getItem("userId");
    // const finalUrl = id ? `${URL}?merchantId=${id}` : URL;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${URL}?merchantId=${id}`, {
            method: 'POST',
            headers: {
                'authorization': token
            },
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            setPoLoading(false)
            return result;
        } else {
            if (response.status == 404) {
                setPoError(result.message);
                setPoLoading(false)
                console.log(result.message);
            } else if (response.status == 403) {
                setPoError(result.message);
                setPoLoading(false)
            } else {
                setPoError(result.message);
                setPoLoading(false)
                console.log(result.message);
            }
        }
    } catch (error) {
        setPoError('An error occurred');
        setPoLoading(false)
    }
}
export default CreatePO;