import PostCard from "@/components/Posts/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostsByAuthor } from "@/hooks/Posts/usePostsByAuthor";
import { MessageSquare } from "lucide-react";

export default function ComunidadeTab({ userId }: { userId: number }) {
    const { data: posts, isLoading } = usePostsByAuthor(userId);

    return (
        <div className="space-y-6 py-4 max-w-[900px] mx-auto">
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full rounded-xl" />
                    ))}
                </div>
            ) : posts && posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-stone-400 mb-4" />
                    <p className="text-lg font-medium text-stone-600">
                        Nenhum post publicado ainda
                    </p>
                    <p className="text-sm text-stone-500 mt-1">
                        Quando o usuário publicar algo na comunidade, os posts aparecerão aqui
                    </p>
                </div>
            )}
        </div>
    );
}
