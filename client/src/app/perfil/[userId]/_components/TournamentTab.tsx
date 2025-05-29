import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Award,
  Star,
  Clock,
  CalendarCheck,
  Vote,
  CheckCircle,
  Loader2,
  Zap,
  Medal,
  Image as ImageIcon,
  MapPin,
  UserCircle
} from 'lucide-react';
import { useUserTournaments } from "@/hooks/User/useUserTournaments";
import ImageModal from "@/components/ImageModal";

export default function TournamentTab({ userId }: { userId: number }) {
  const { tournaments, isLoading, isError } = useUserTournaments(userId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-stone-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
        <Zap className="h-5 w-5" />
        <span>Erro ao carregar torneios do usuário</span>
      </div>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Trophy className="h-12 w-12 text-stone-400 mb-4" />
        <p className="text-lg font-medium text-stone-600">
          Nenhum torneio participado ainda
        </p>
        <p className="text-sm text-stone-500 mt-1">
          Quando o usuário participar de torneios, eles aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Modal para exibir a foto em tamanho maior */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.filter(tournament => tournament.participation.position > 0).map((tournament) => (
          <div
            key={tournament.id}
            className={`bg-stone-50 rounded-lg shadow-sm border border-stone-200 overflow-hidden
              ${tournament.participation.position === 1 ? 'border-yellow-400 border-2' : ''}
              ${tournament.participation.position === 2 ? 'border-gray-300 border-2' : ''}
              ${tournament.participation.position === 3 ? 'border-amber-600 border-2' : ''}
            `}
          >
            {/* Banner do torneio */}
            <Link href={`/torneios/${tournament.id}`}>
              <div className="relative h-40 bg-stone-200">
                {tournament.bannerUrl && (
                  <Image
                    src={tournament.bannerUrl}
                    alt={`Banner do torneio ${tournament.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    <span>{tournament.title}</span>
                  </h3>
                </div>
              </div>
            </Link>

            {/* Conteúdo */}
            <div className="p-4">
              <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                {tournament.description}
              </p>

              {/* Status e datas */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                    tournament.phase === 4
                      ? "bg-purple-100 text-purple-800"
                      : tournament.phase === 3
                      ? "bg-blue-100 text-blue-800"
                      : tournament.phase === 2
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-stone-100 text-stone-800"
                  }`}
                >
                  {getPhaseIcon(tournament.phase)}
                  {getPhaseText(tournament.phase)}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <CalendarCheck className="h-3 w-3" />
                  {new Date(tournament.endDate).toLocaleDateString()}
                </span>
              </div>

              {/* Foto enviada e desempenho */}
              <div className="border-t border-stone-200 pt-4">
                <div className="flex items-start gap-4">
                  {tournament.participation.photoUrl && (
                    <div className="relative">
                      {/* Medalha de posição */}
                      {tournament.participation.position <= 3 && (
                        <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10
                          ${tournament.participation.position === 1 ? 'bg-yellow-400 text-stone-800' : ''}
                          ${tournament.participation.position === 2 ? 'bg-gray-300 text-stone-800' : ''}
                          ${tournament.participation.position === 3 ? 'bg-amber-600 text-stone-800' : ''}
                        `}>
                          <Medal className="w-4 h-4" />
                        </div>
                      )}
                      <button
                        onClick={() => handleImageClick(tournament.participation.photoUrl!)}
                        className="relative h-16 w-16 rounded-md overflow-hidden border border-stone-300 hover:ring-2 hover:ring-purple-500 transition-all"
                        aria-label="Ampliar foto do torneio"
                      >
                        <Image
                          src={tournament.participation.photoUrl}
                          alt={`Foto enviada para ${tournament.title}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-stone-400" />
                          {tournament.participation.photoTitle || "Sem título"}
                        </h4>
                        {/* {tournament.participation.location && (
                          <p className="text-stone-400 text-xs flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {tournament.participation.location}
                          </p>
                        )} */}
                      </div>
                      <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {tournament.participation.points} pts
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center text-sm font-medium text-stone-700">
                          <Trophy className="h-4 w-4 mr-1 text-purple-600" />
                          {tournament.participation.position}º lugar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper para texto da fase
function getPhaseText(phase: number): string {
  switch (phase) {
    case 1:
      return "Em breve";
    case 2:
      return "Inscrições abertas";
    case 3:
      return "Em votação";
    case 4:
      return "Encerrado";
    default:
      return "Desconhecido";
  }
}

// Helper para ícone da fase
function getPhaseIcon(phase: number) {
  switch (phase) {
    case 1:
      return <Clock className="h-3 w-3" />;
    case 2:
      return <Vote className="h-3 w-3" />;
    case 3:
      return <Star className="h-3 w-3" />;
    case 4:
      return <CheckCircle className="h-3 w-3" />;
    default:
      return <Zap className="h-3 w-3" />;
  }
}