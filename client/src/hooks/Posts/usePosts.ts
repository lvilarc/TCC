// src/hooks/usePosts.ts
import fetchWithToken from '@/utils/fetchWithToken';
import { useQuery } from '@tanstack/react-query';

export interface Post {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        name: string;
        avatarUrl: string | null;
    };
    comments: {
        id: number;
        content: string;
        createdAt: string;
        author: {
            id: number;
            name: string;
            avatarUrl: string | null;
        };
    }[];
    photos: {
        id: number;
        url: string;
    }[];
    likes: {
        id: number;
        userId: number;
        postId: number;
    }[];
}

export const usePosts = () => {
    return useQuery<Post[]>({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await fetchWithToken(`/post`);
            if (!res.ok) throw new Error('Erro ao buscar posts');
            return res.json();
        },
    });
};