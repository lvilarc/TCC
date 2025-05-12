import PostCard from "@/components/Posts/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/Posts/usePosts";

export default function ComunidadeTab({ userId }: { userId: number }) {
    const { data: posts, isLoading } = usePosts();
    return (
        <div className="space-y-6 py-4 max-w-[900px]">
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
    )
}