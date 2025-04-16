import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetch = (url, options = {}, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelTokenSource, setCancelTokenSource] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const source = axios.CancelToken.source();
        setCancelTokenSource(source);

        try {
            const response = await axios({
                url,
                ...options,
                cancelToken: source.token,
            });
            setData(response.data);
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Fetch canceled:', err.message);
            } else {
                setError(err.response?.data?.message || 'An error occurred while fetching data.');
            }
        } finally {
            setLoading(false);
        }
    }, [url, options, ...dependencies]);

    useEffect(() => {
        fetchData();

        // Cleanup function to cancel the request if the component unmounts
        return () => {
            if (cancelTokenSource) {
                cancelTokenSource.cancel('Operation canceled by the user.');
            }
        };
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;
