import fetchWithToken from '@/utils/fetchWithToken';
import { useMutation } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface CreateParticipationRequest {
    tournamentId: number;
    title?: string;
    location?: string;
    file: File;  // O arquivo a ser enviado
}

const createParticipation = async (createParticipationRequest: CreateParticipationRequest) => {
    const endpoint = `/participation`; // A rota para a criação da participação
    const formData = new FormData(); // FormData é utilizado para enviar arquivos junto com os dados

    // Adiciona os dados no FormData
    formData.append('tournamentId', createParticipationRequest.tournamentId.toString());
    if (createParticipationRequest.title) formData.append('title', createParticipationRequest.title);
    if (createParticipationRequest.location) formData.append('location', createParticipationRequest.location);
    formData.append('File', createParticipationRequest.file);  // Adicionando o arquivo

    const response = await fetchWithToken(endpoint, {
        method: 'POST',
        body: formData,  // O corpo da requisição agora é o FormData
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
    }

    return response.json();
};

export function useCreateParticipation() {
    const { mutate, isPending, isError, isSuccess, data, error, mutateAsync } = useMutation({
        mutationFn: createParticipation,
        onError: (error) => {
            console.error('Erro ao criar participação:', error);
        },
        onSuccess: (data) => {
            console.log('Participação criada com sucesso:', data);
        },
    });

    return { mutate, mutateAsync, isPending, isError, isSuccess, data, error };
}
