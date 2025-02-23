import fetchWithToken from '@/utils/fetchWithToken';
import { useMutation } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface CreateTournamentRequest {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    file: File;  // O arquivo do banner a ser enviado
}

const createTournament = async (createTournamentRequest: CreateTournamentRequest) => {
    const endpoint = `/tournaments`; // A rota para a criação do torneio
    const formData = new FormData(); // FormData para enviar dados e arquivos

    // Adiciona os dados no FormData
    formData.append('title', createTournamentRequest.title);
    formData.append('description', createTournamentRequest.description);
    formData.append('startDate', createTournamentRequest.startDate);
    formData.append('endDate', createTournamentRequest.endDate);
    formData.append('File', createTournamentRequest.file);  // Adiciona o banner do torneio

    const response = await fetchWithToken(endpoint, {
        method: 'POST',
        body: formData,  // Envia o FormData como o corpo da requisição
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json();
};

export function useCreateTournament() {
    const { mutate, isPending, isError, isSuccess, data, error, mutateAsync } = useMutation({
        mutationFn: createTournament,
        onError: (error) => {
            console.error('Erro ao criar torneio:', error);
        },
        onSuccess: (data) => {
            console.log('Torneio criado com sucesso:', data);
        },
    });

    return { mutate, mutateAsync, isPending, isError, isSuccess, data, error };
}
