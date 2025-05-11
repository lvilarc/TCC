// app/comunidade/components/PostCard.tsx
import { MessageCircle, Heart } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Post } from '@/hooks/Posts/usePosts';
import { UserCircle } from '../icons/UserCircle';
import PostImages from './PostImages';
import Link from 'next/link';

const PostCard = ({ post }: { post: Post }) => {
    if (!post) return null;
    return (
        <Card className="w-full p-4 space-y-3">
            {/* Header com avatar e nome */}
            <div className="flex items-center gap-3">
                <Link href={`/perfil/${post.author.id}`}>
                    {post.author.avatarUrl ? (
                        <Image
                            src={post.author.avatarUrl}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <UserCircle size={40} />
                    )}
                </Link>
                <Link href={`/perfil/${post.author.id}`}>
                    <p className="font-semibold text-gray-800 hover:underline">{post.author.name}</p>
                </Link>
            </div>

            {/* Conteúdo do post */}
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

            {/* Imagens do post */}
            <PostImages post={post} />

            {/* Ações: like e comentário */}
            <div className="flex items-center gap-6 pt-2">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition">
                    <Heart className="w-5 h-5" strokeWidth={1.5} />
                    <span>{post.likes.length}</span>
                </button>

                <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                    <span>{post.comments.length}</span>
                </div>
            </div>
        </Card>
    );
};

export default PostCard;
