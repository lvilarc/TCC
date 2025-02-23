import fetchWithToken from '@/utils/fetchWithToken';
import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const fetchTournaments = async (filter?: string) => {
    const endpoint = new URL(`${API_URL}/tournaments`);
    
    if (filter) {
        endpoint.searchParams.append('filter', filter); 
    }

    const response = await fetchWithToken(endpoint);

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json();
};

interface UseTournamentsParams {
  filter?: string;
}

export function useTournaments({ filter }: UseTournamentsParams) {
    const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
        queryKey: ['tournaments', filter],  // Adicionando 'filter' ao queryKey para revalidar corretamente
        queryFn: () => fetchTournaments(filter),
    });

    return { data, error, isLoading, isError, isSuccess, refetch };
}
