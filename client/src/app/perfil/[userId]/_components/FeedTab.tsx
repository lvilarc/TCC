import { getUserPhotos } from "@/hooks/User/useUser";
import AddPhotoCard from "./AddPhotoCard";
import { CameraOff } from "lucide-react";
import { useState } from "react";
import ImageModal from "@/components/ImageModal";

export default function FeedTab({ userId, isOwner }: { userId: number, isOwner: boolean }) {
  const { data: photos = [], isLoading, isError } = getUserPhotos(userId);

  const feedPhotos = photos.filter((photo) => photo.type === "FEED_PHOTO");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const openModal = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Carregando fotos...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar fotos</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 py-12">

      <ImageModal
        imageUrl={currentImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {feedPhotos.length === 0 ? (
        <>
          {isOwner ? (
            <AddPhotoCard></AddPhotoCard>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 max-w-[900px] mx-auto">
              <CameraOff className="w-10 h-10 text-stone-400" />
              <p className="text-lg font-medium text-stone-600">
                Ainda não há nenhuma foto
              </p>
              <p className="text-sm text-stone-500">
                Quando o usuário publicar fotos, elas aparecerão aqui
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
                onClick={() => openModal(photo.url)}
              />
              {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="font-semibold text-lg">{photo.title || "foto"}</span>
                <div className="flex text-sm mt-2">
                  <span>❤️ {photo.likes}</span>
                </div>
              </div> */}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
