import { useMutation } from '@tanstack/react-query';

export interface SignUpRequest {
    name: string;
    username: string;
    email: string;
    password: string;
}

const signUp = async (signUpRequest: SignUpRequest) => {
    const endpoint = '/users/'
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
            console.log("Usuário cadastrado com sucesso:", data);
        },
    });

    return { signUp: mutate, isPending, isError, isSuccess, data, error };
}
