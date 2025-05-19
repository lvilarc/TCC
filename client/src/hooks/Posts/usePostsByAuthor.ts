// src/hooks/usePostsByAuthor.ts
import fetchWithToken from '@/utils/fetchWithToken';
import { useQuery } from '@tanstack/react-query';
import { Post } from './usePosts';


export const usePostsByAuthor = (authorId: number | string) => {
    return useQuery<Post[]>({
        queryKey: ['posts', 'author', authorId],
        queryFn: async () => {
            const res = await fetchWithToken(`/post/author/${authorId}`);
            if (!res.ok) throw new Error('Erro ao buscar posts do autor');
            return res.json();
        },
        enabled: !!authorId, // só executa se authorId for truthy
    });
};
