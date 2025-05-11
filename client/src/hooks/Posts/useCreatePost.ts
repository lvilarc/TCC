import fetchWithToken from '@/utils/fetchWithToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePostResponse {
    content: string;
    authorId: number;
    photos: { id: number; url: string }[];
    // Adicione outros campos conforme a resposta da sua API
}

interface CreatePostPayload {
    content: string;
    files: File[];
}

// Função que cria o post (enviando `content` e `files`)
const createPost = async ({ content, files }: CreatePostPayload): Promise<CreatePostResponse> => {
    const formData = new FormData();
    formData.append('content', content);

    // Anexando as imagens ao FormData
    files.forEach((file) => {
        formData.append('files', file);
    });

    const response = await fetchWithToken(`/post`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Erro ao criar o post');
    }

    return response.json();
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<CreatePostResponse, Error, CreatePostPayload>({
        mutationFn: createPost, // A função de mutação agora recebe o payload com content e files
        onError: (error: any) => {
            console.error('Erro ao criar o post:', error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            console.log('Post criado com sucesso!');
        },
    });

    return {
        createPost: mutation.mutateAsync,
        isPending: mutation.isPending,  // Agora funciona corretamente
        isError: mutation.isError,
        error: mutation.error,
    };
};
