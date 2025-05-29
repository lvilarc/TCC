import fetchWithToken from '@/utils/fetchWithToken';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateDescriptionResponse {
  id: number;
  username: string;
  desc: string | null;
  // Outros campos do usuário conforme necessário
}

interface UpdateDescriptionPayload {
  desc: string;
}

const updateDescription = async ({ desc }: UpdateDescriptionPayload): Promise<UpdateDescriptionResponse> => {
  const response = await fetchWithToken('/users/me/desc', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ desc }),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar a descrição');
  }

  return response.json();
};

export const useUpdateUserDescription = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<UpdateDescriptionResponse, Error, UpdateDescriptionPayload>({
    mutationFn: updateDescription,
    onError: (error: Error) => {
      console.error('Erro ao atualizar descrição:', error.message);
    },
    onSuccess: (data) => {
      // Invalida a query do usuário para garantir que os dados sejam atualizados
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      // Atualiza também a query do usuário atual se estiver em cache
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      console.log('Descrição atualizada com sucesso!');
    },
  });

  return {
    updateDescription: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};