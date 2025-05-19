"use client"

import { MessageCircle, Heart, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Post } from '@/hooks/Posts/usePosts';
import { UserCircle } from '../icons/UserCircle';
import PostImages from './PostImages';
import Link from 'next/link';
import { useState } from 'react';
import { useCreateComment } from '@/hooks/Posts/useCreateComment';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/AuthContext/useAuthContext';

const PostCard = ({ post }: { post: Post }) => {
    const [comment, setComment] = useState('');
    const { createComment, isPending } = useCreateComment();
    const [showAllComments, setShowAllComments] = useState(false);
    const { user } = useAuthContext();

    if (!post) return null;

    const handleSubmit = async () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent("openLoginModal"))
            return;
        }
        if (!comment.trim()) return;
        try {
            await createComment({ postId: post.id, content: comment });
            setComment('');
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
        }
    };

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
                <div className="flex items-center gap-1 text-gray-500">
                    <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                    <span>{post.comments.length}</span>
                </div>
            </div>

            {/* Comentários */}
            {post.comments.length > 0 && (
                <div className="pt-2 space-y-2 border-t">
                    {(showAllComments ? post.comments : [post.comments[0]]).map((comment) => (
                        <div key={comment.id} className="flex items-center gap-1 text-sm text-gray-800 p-2 rounded-md">
                            <Link href={`/perfil/${comment.author.id}`}>
                                {comment.author.avatarUrl ? (
                                    <Image
                                        src={comment.author.avatarUrl}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <UserCircle size={32} />
                                )}
                            </Link>
                            <div>
                                <Link href={`/perfil/${comment.author.id}`}>
                                    <span className="font-semibold hover:underline cursor-pointer">
                                        {comment.author.name}:
                                    </span>
                                </Link>{' '}
                                <span className='ml-2'>{comment.content}</span>
                            </div>
                        </div>
                    ))}

                    {post.comments.length > 1 && !showAllComments && (
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => setShowAllComments(true)}
                                className="flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900 hover:underline"
                            >
                                Ver mais comentários <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}



            {/* Campo para adicionar comentário */}
            <div className="pt-2 flex gap-2">
                <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                {comment && (
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {isPending ? 'Enviando...' : 'Enviar'}
                    </button>
                )}
            </div>

        </Card>
    );
};

export default PostCard;
