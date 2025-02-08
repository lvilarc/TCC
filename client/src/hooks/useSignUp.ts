import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

export interface SignUpRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const signUp = async (signUpRequest: SignUpRequest) => {
    const endpoint = `${API_URL}/auth/signup`
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signUpRequest),
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json();
};

export function useSignUp() {
    const { mutate, isPending, isError, isSuccess, data, error } = useMutation({
        mutationFn: signUp,
        onError: (error) => {
            console.error("Erro ao cadastrar:", error);
        },
        onSuccess: (data) => {
            const { token } = data;
            Cookies.set('token', token, { expires: 7 });
        },
    });

    return { signUp: mutate, isPending, isError, isSuccess, data, error };
}