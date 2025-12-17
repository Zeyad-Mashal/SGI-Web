const URL = "https://sgi-dy1p.onrender.com/api/v1/user/merchant/details";
const Trader = async (setTraderDetails, setTraderStats, setError, setLoading) => {
    setLoading(true)
    const token = localStorage.getItem("sgitoken");

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `sgiQ${token}`
            },
        });

        const result = await response.json();

        if (response.ok) {
            setTraderDetails(result.merchant)
            setTraderStats(result.stats)
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
export default Trader;