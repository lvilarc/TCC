import { useMutation } from '@tanstack/react-query';

export interface LoginRequest {
    email: string;
    password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const login = async (loginRequest: LoginRequest) => {
    const endpoint = `${API_URL}/auth/login`
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw { status: response.status, ...errorResponse };
    }

    return response.json();
};

export function useLogin() {
    const { mutate, isPending, isError, isSuccess, data, error, mutateAsync } = useMutation({
        mutationFn: login,
        onError: (error) => {
            console.error("Erro ao logar:", error);
        },
        onSuccess: (data) => {
            // const { token } = data;
            // Cookies.set('token', token, { expires: 7 });
        },
    });

    return { mutate, mutateAsync, isPending, isError, isSuccess, data, error };
}