import fetchWithToken from '@/utils/fetchWithToken';
import { useQuery } from '@tanstack/react-query';

export interface StartVotingRequest {
    tournamentId: number;
}

const startVoting = async ({ tournamentId }: StartVotingRequest) => {
    const endpoint = `/vote/start?tournamentId=${tournamentId}`;

    const response = await fetchWithToken(endpoint, { method: 'GET' });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json();
};

export function useStartVoting(tournamentId: number) {
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['startVoting', tournamentId], 
        queryFn: () => startVoting({ tournamentId }),
        staleTime: 0, 
        refetchOnWindowFocus: false, 
        enabled: false,
    });

    return { data, isLoading, isError, error, refetch };
}
