'use client';

import { Camera, X } from 'lucide-react';
import { useState } from 'react';
import PostCard from '@/components/Posts/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Post, usePosts } from '@/hooks/Posts/usePosts';
import UploadPhotoPostModal from '@/components/Posts/UploadPhotoPostModal';
import Image from 'next/image';
import { useCreatePost } from '@/hooks/Posts/useCreatePost';
import { useAuthContext } from '@/hooks/AuthContext/useAuthContext';

export default function ComunidadePage() {
    const { data: posts, isLoading } = usePosts();
    const { createPost, isPending: isPostCreating, isError, error } = useCreatePost();
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const { user } = useAuthContext();

    const handlePublish = async () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent("openLoginModal"))
            return;
        }

        if (content.trim() === '') return alert('O conteúdo do post não pode estar vazio!');

        try {
            await createPost({ content, files: images });
            setContent(''); // Limpa o conteúdo após publicar
            setImages([]);  // Limpa as imagens após publicar
        } catch (err) {
            alert('Erro ao criar o post.');
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = (newFiles: File[]) => {
        setImages((prev) => [...prev, ...newFiles]);
    };

    return (
        <div className='w-full bg-stone-200 mt-[-12px]'>
            <div className="max-w-4xl mx-auto p-10 space-y-6 bg-white border-r-2 border-l-2 border-stone-100">
                {showUploadModal && (
                    <UploadPhotoPostModal
                        onClose={() => setShowUploadModal(false)}
                        onUpload={handleUpload}
                    />
                )}

                <p className='font-semibold text-lg'>Comunidade</p>

                {/* Seção de publicação */}
                <div className="w-full bg-white space-y-2">
                    <textarea
                        value={content}
                        onChange={(e) => {
                            if (e.target.value.length <= 300) {
                                setContent(e.target.value);
                            }
                        }}
                        rows={4}
                        maxLength={300}
                        className="w-full p-2 h-32 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black resize-none overflow-y-auto"
                        placeholder="Compartilhe suas fotos e histórias com a comunidade..."
                    />

                    {/* Miniaturas das imagens */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {images.map((file, index) => (
                                <div key={index} className="relative w-24 h-24 rounded overflow-hidden border">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={`upload-${index}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`flex gap-4 ${images.length === 0 ? 'justify-between' : 'justify-end'}`}>
                        {images.length === 0 && (
                            <button
                                className="flex items-center text-sm gap-2 text-slate-500 hover:text-slate-700 font-medium"
                                onClick={() => setShowUploadModal(true)}
                            >
                                <Camera className="w-5 h-5" />
                                Adicionar foto
                            </button>
                        )}

                        <button
                            className="px-4 py-2 bg-black font-semibold text-sm text-white rounded-md hover:bg-slate-600 transition"
                            onClick={handlePublish}
                        >
                            Publicar
                        </button>
                    </div>
                </div>

                {/* Lista de posts */}
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-40 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        posts?.map((post) => <PostCard key={post.id} post={post} />)
                    )}
                </div>
            </div>
        </div>
    );
}
