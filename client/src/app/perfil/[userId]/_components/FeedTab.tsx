import { getUserPhotos } from "@/hooks/User/useUser";
import AddPhotoCard from "./AddPhotoCard";
import { CameraOff } from "lucide-react";

export default function FeedTab({ userId, isOwner }: { userId: number, isOwner: boolean }) {
  const { data: photos = [], isLoading, isError } = getUserPhotos(userId);

  const feedPhotos = photos.filter((photo) => photo.type === "FEED_PHOTO");

  if (isLoading) {
    return <div>Carregando fotos...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar fotos</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 py-12">

      {feedPhotos.length === 0 ? (
        <>
          {isOwner ? (
            <AddPhotoCard></AddPhotoCard>
          ) : (
            <div className="w-full mt-12 text-center space-y-3">
              <CameraOff className="w-10 h-10 text-stone-800 mx-auto" />
              <p className="text-stone-800 text-lg font-medium">
                Ainda não há nenhuma foto
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {isOwner && <AddPhotoCard></AddPhotoCard>}
          {feedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative group h-96 w-96 overflow-hidden rounded-lg cursor-pointer border border-stone-200"
            >
              <img
                src={photo.url}
                alt={photo.title || "foto"}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="font-semibold text-lg">{photo.title || "foto"}</span>
                <div className="flex text-sm mt-2">
                  <span>❤️ {photo.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
