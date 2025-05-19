// src/hooks/Posts/useCreateComment.ts
import fetchWithToken from '@/utils/fetchWithToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateCommentPayload {
  postId: number;
  content: string;
}

interface CreateCommentResponse {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  author: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
}

const createComment = async ({ postId, content }: CreateCommentPayload): Promise<CreateCommentResponse> => {
  const response = await fetchWithToken(`/post/${postId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar comentário');
  }

  return response.json();
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateCommentResponse, Error, CreateCommentPayload>({
    mutationFn: createComment,
    onError: (error) => {
      console.error('Erro ao comentar:', error);
    },
    onSuccess: (_data, variables) => {
      // Atualiza a lista de posts para refletir o novo comentário
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Ou apenas invalidar um post específico, se houver query separada
      // queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });

  return {
    createComment: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
