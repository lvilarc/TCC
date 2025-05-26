import fetchWithToken from '@/utils/fetchWithToken';
import { useMutation } from '@tanstack/react-query';

export enum VotingMethod {
    TOP_THREE = 'TOP_THREE', // Escolher 3 entre 10 fotos
    DUEL = 'DUEL', // Batalha entre 2 fotos
    RATING = 'RATING', // Avaliação de 1 a 5 estrelas
    SUPER_VOTE = 'SUPER_VOTE', // Escolher 1 entre 30-40 fotos
}

export interface SubmitVoteRequest {
    tournamentId: number;
    method: VotingMethod;
    phase: 1 | 2;
    votes: { photoId: number; voteScore: number }[]; 
    shownPhotoIds: number[];
}

const submitVote = async (submitVoteRequest: SubmitVoteRequest) => {
    const endpoint = `/vote/submit`; 

    const response = await fetchWithToken(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitVoteRequest), 
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json(); 
};

export function useSubmitVote() {
    const { mutate, isPending, isError, isSuccess, data, error, mutateAsync } = useMutation({
        mutationFn: submitVote,
        onError: (error) => {
            console.error('Erro ao submeter voto:', error);
        },
        onSuccess: (data) => {
            console.log('Voto registrado com sucesso:', data);
        },
    });

    return { mutate, mutateAsync, isPending, isError, isSuccess, data, error };
}
