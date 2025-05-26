import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VoteAgoraIcon } from "./icons/VoteAgoraIcon";
import { ArrowLongRightIcon } from "./icons/ArrowRightIcon";
import { useSubmitVote, VotingMethod } from "@/hooks/Vote/useSubmitVote";
import { useStartVoting } from "@/hooks/Vote/useStartVoting";
import { CheckIcon } from "lucide-react";

// Componente StarRating
const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => {
  const handleClick = (value: number) => {
    onChange(value);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleClick(star)}
          xmlns="http://www.w3.org/2000/svg"
          fill={rating >= star ? "yellow" : "none"}
          viewBox="0 0 24 24"
          stroke="black"
          className="w-16 h-16 cursor-pointer"
        >
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            strokeWidth="2"
          />
        </svg>
      ))}
    </div>
  );
};

const VotingMethods = {
  TOP_THREE: {
    label: "Escolha as 3 melhores fotos",
    maxSelection: 3, // Número máximo de fotos que o usuário pode selecionar
  },
  DUEL: {
    label: "Escolha a melhor foto",
    maxSelection: 1, // Só pode selecionar uma foto
  },
  RATING: {
    label: "Avalie a foto",
    maxSelection: 0, // Não pode selecionar fotos
  },
  SUPER_VOTE: {
    label: "Escolha a melhor foto",
    maxSelection: 1, // Só pode selecionar uma foto
  },
};

const votingStages = Object.keys(VotingMethods) as (keyof typeof VotingMethods)[];

type VoteModalProps = {
  onClose: () => void;
  // data: {
  //   method: keyof typeof VotingMethods;
  //   photos: any[];
  //   phaseProgress: 1 | 2;
  // };
  tournamentTitle: string;
  tournamentId: number;
};

export default function VoteModal({ onClose, tournamentTitle, tournamentId }: VoteModalProps) {
  const { data: startVotingData, isLoading, isError: startVotingIsError, refetch } = useStartVoting(tournamentId)

  useEffect(() => {
    // Chama o refetch assim que o modal for aberto
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (startVotingData) {
      console.log('startVotingData', startVotingData);
    }
  }, [startVotingData]);

  // Inicializar o estado de seleção de fotos
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Obter as regras do método de votação
  const method = startVotingData?.method as VotingMethod;
  const phaseProgress = startVotingData?.phaseProgress;
  const photos = startVotingData?.photos;
  const methodRules = VotingMethods[method] ?? { maxSelection: 0 };

  const [rating, setRating] = useState<number | null>(null);
  const canProceed = method === "RATING" ? rating !== null : selectedPhotos.length === methodRules.maxSelection;

  const { mutateAsync: submitVote, isPending, isError, isSuccess } = useSubmitVote();


  // Função para selecionar ou desmarcar uma foto
  const handleSelectPhoto = (photoUrl: string) => {
    if (selectedPhotos.includes(photoUrl)) {
      // Se a foto já foi selecionada, desmarque-a
      setSelectedPhotos(selectedPhotos.filter((url) => url !== photoUrl));
    } else if (selectedPhotos.length < methodRules.maxSelection) {
      // Se o número máximo de seleções não foi alcançado, marque a foto
      setSelectedPhotos([...selectedPhotos, photoUrl]);
    }
  };
  const currentStageIndex = votingStages.indexOf(method);
  // Definir o título com base no método de votação
  const label = methodRules ? methodRules.label : "Votação";

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitVote = async () => {
    try {
      if (!startVotingData) return;

      const voteScore = (() => {
        switch (method) {
          case "TOP_THREE":
            return 1;  // Para o método TOP_THREE, o voteScore é 1
          case "DUEL":
            return 2;  // Para o método DUEL, o voteScore é 2
          case "RATING":
            return rating ?? 0;  // Para o método RATING, o voteScore é o rating selecionado
          case "SUPER_VOTE":
            return 4;  // Para o método SUPER_VOTE, o voteScore é 4
          default:
            return 1;  // Default, caso o método não seja reconhecido
        }
      })();

      const votes = (() => {
        if (method === VotingMethod.RATING) {
          return [{
            photoId: Number(photos[0].id),
            voteScore
          }]
        } else {
          return selectedPhotos.map((photoUrl) => ({
            photoId: Number(photos.find((photo: { id: number; presignedUrl: string; }) => photo.presignedUrl === photoUrl)?.id),
            voteScore,
          }))
        }
      })();

      console.log(startVotingData)

      await submitVote({
        tournamentId,
        method,
        phase: phaseProgress,
        votes: votes,
        shownPhotoIds: startVotingData.photoIds
      });
      await refetch();
      setSelectedPhotos([]);
    } catch (error) {
      console.error("Erro ao enviar votos:", error);
    }
  };


  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[98vw] h-[94vh] flex flex-col bg-stone-800 text-white select-none flex-grow`}>
        <DialogTitle className="text-2xl flex items-center gap-4">
          <span>{tournamentTitle}</span>
          {startVotingData && startVotingData.completed ? null : (
            <>
              <span className="text-xl font-normal">{label}</span>
              <div className="relative w-96 h-4 bg-gray-500 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${(currentStageIndex) / votingStages.length * 100}%` }}
                />
              </div>
            </>
          )}
        </DialogTitle>
        {startVotingData && startVotingData.completed ? (
          <div className="flex flex-col justify-center items-center w-full h-full opacity-0 scale-75 animate-fadeInScale">
            <div className="flex items-center mb-8 bg-stone-700 text-white py-1 px-2 rounded-full gap-1">
              <div className="relative w-96 h-4 bg-gray-500 rounded-full overflow-hidden ">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-800 via-green-500 to-purple-800"
                  style={{
                    width: `100%`,
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 4s ease-out',
                  }}
                ></div>
                <style jsx>{`
                  @keyframes gradientShift {
                    0% {
                      background-position: 200% 0%;
                    }
                    100% {
                      background-position: 0% 0%;
                    }
                  }
                `}</style>
              </div>
              <CheckIcon
                className="transition-all duration-700 ease-in-out opacity-0 scale-50 animate-check-icon"
              />
            </div>
            <div className="text-4xl text-white font-bold mb-8 text-center">
              Você concluiu sua votação! Obrigado pela sua participação.
            </div>
            <button
              className="text-white py-2 px-14 font-semibold rounded-md bg-purple-500 text-xl"
              onClick={onClose} // Supondo que onClose seja o método para fechar o modal
            >
              Sair
            </button>
          </div>
        ) : (
          <div className={`columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-1 overflow-auto w-full bg-stone-800 select-none`}>
            {startVotingData && startVotingData.photos.length > 0 && startVotingData.photos.map((photo: any, index: number) => {
              const isSelected = selectedPhotos.includes(photo.presignedUrl);
              return (
                <div
                  key={index}
                  className={`mb-1 break-inside-avoid relative ${method === "RATING" ? 'group' : 'cursor-pointer'}`}
                  onClick={() => handleSelectPhoto(photo.presignedUrl)}
                >
                  {method !== "RATING" ? (
                    <div
                      className={`absolute top-1/2 left-1/2 w-[200px] z-20 
                   transform -translate-x-1/2 -translate-y-1/2 
                   opacity-0 scale-75 transition-all duration-300 ease-out
                   ${isSelected ? "opacity-100 scale-100" : ""}`}
                    >
                      <VoteAgoraIcon />
                    </div>
                  ) : null}
                  <img
                    src={photo.presignedUrl}
                    className={`w-full object-cover`}
                    alt={`Foto ${index + 1}`}
                    draggable={false}
                  />
                  {method === "RATING" && (
                    <div className={`absolute top-1/2 -translate-y-1/2  left-0 w-full bg-black/50 p-2 pt-4 flex 
                    justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100
                    ${rating ? 'opacity-100' : ''}
                    `}>
                      <StarRating
                        onChange={(rating) => handleRatingChange(rating)}
                        rating={rating || 0}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <button
          className={`absolute flex items-center gap-2 z-50 right-20 bottom-20 bg-purple-500 text-white border border-purple-600 shadow-md py-2 px-10 
              font-semibold rounded-md uppercase text-lg transition-all duration-300 ease-out 
              transform ${canProceed ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`}
          disabled={!canProceed}
          onClick={handleSubmitVote}
        >
          {method === VotingMethod.SUPER_VOTE ? (
            <>
              Concluir
            </>
          ) : (
            <>
              Próximo<ArrowLongRightIcon />
            </>
          )}
        </button>
      </DialogContent>
    </Dialog >
  );
}
