import { useState, useEffect } from 'react';
// import Error from './Error';
const useAxios = (url, isList, page, searchTerm, startsWith, offset) => {
    const axios = require('axios');
    const md5 = require('md5');
    const publickey = process.env.publicKey;
    const privatekey = process.env.privateKey;
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public';
    const keyHash = 'ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    let fetchUrl = '';

    if (searchTerm) {
        fetchUrl = `${baseUrl}/${url}?${startsWith}${searchTerm}&${keyHash}&offset=${offset}`;
        // console.log(fetchUrl);
    } else if (isList) {
        fetchUrl = `${baseUrl}/${url}?${keyHash}&offset=${offset}`;
    } else {
        fetchUrl = `${baseUrl}/${url}?${keyHash}`;
    }

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        const getData = async () => {
            try {
                let { data } = await axios.get(fetchUrl);

                setData(data.data);
                setLoading(false);
                if (!data) setError(true);
                else if (data.data.results.length == 0) setError(true);
            } catch (e) {
                setLoading(false);
                setData(null);
                console.log(e);
            }
        };
        getData();
    }, [url, page, searchTerm]);

    return [data, loading, error];
};
export default useAxios;
