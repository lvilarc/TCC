import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

async function fetchWithToken(urlOrEndpoint: string | URL, options?: RequestInit) {
    let url: URL;
    if (typeof urlOrEndpoint === 'string') {
        url = new URL(`${API_URL}${urlOrEndpoint}`);
    } else {
        url = urlOrEndpoint;
    }
    const token = Cookies.get('token');

    if (!token) {
        window.dispatchEvent(new CustomEvent('sessionExpired', { detail: { message: 'Token expirado' } }));
    }

    const requestOptions = {
        ...options,
        headers: {
            ...options?.headers,
            'Authorization': `Bearer ${token}`
        }
    };

    const res = await fetch(url.toString(), requestOptions);

    if (res.status === 401) {
        window.dispatchEvent(new CustomEvent('sessionExpired', { detail: { message: 'Token expirado' } }));
    }

    return res;
}

export default fetchWithToken;
