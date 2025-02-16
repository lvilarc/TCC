import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const fetchTournaments = async () => {
    const endpoint = `${API_URL}/tournaments`;
    const response = await fetch(endpoint);

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json();
};

export function useTournaments() {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
        queryKey: ['tournaments'],
        queryFn: fetchTournaments,
    });

    return { data, error, isLoading, isError, isSuccess, refetch };
}
