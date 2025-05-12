import { getUserPhotos } from "@/hooks/User/useUser";

export default function TournamentTab({userId}: {userId: number}) {
  const { data: photos = [], isLoading, isError } = getUserPhotos(userId);

  const tournamentPhotos = photos.filter(
    (photo) => photo.type === "FEED_PHOTO"
  );

  if (isLoading) {
    return <div>Carregando fotos...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar fotos</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 py-12">
      {tournamentPhotos?.map((photo) => (
        <div
          key={photo.id}
          className="relative group h-60 w-96 overflow-hidden rounded-lg"
        >
          {/* Photo */}
          <img
            src={photo.url}
            alt={photo.title || "foto"}
            className="h-full w-full object-cover"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
            <span className="font-semibold text-lg">
              {photo.title || "foto"}
            </span>
            <span className="text-sm">{""}</span>
            <div className="flex text-sm mt-2">
              <span>❤️ {photo.likes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
