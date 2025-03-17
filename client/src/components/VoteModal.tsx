import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VoteAgoraIcon } from "./icons/VoteAgoraIcon";
import { ArrowLongRightIcon } from "./icons/ArrowRightIcon";

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
  data: {
    method: keyof typeof VotingMethods;
    photos: any[];
  };
  tournamentTitle: string;
};

export default function VoteModal({ onClose, data, tournamentTitle }: VoteModalProps) {
  // Inicializar o estado de seleção de fotos
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Obter as regras do método de votação
  const method = data?.method;
  const methodRules = VotingMethods[method] ?? { maxSelection: 0 };

  const canProceed = selectedPhotos.length === methodRules.maxSelection;

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
  const title = methodRules ? methodRules.label : "Votação";
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[98vw] h-[94vh] flex flex-col bg-stone-800 text-white select-none`}>
        <DialogTitle className="text-2xl flex items-center gap-4">
          <span>{tournamentTitle}</span>
          <span className="text-xl font-normal">{title}</span>
          <div className="relative w-96 h-4 bg-gray-500 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStageIndex) / votingStages.length * 100}%` }}
            />
          </div>
        </DialogTitle>
        <div className="flex gap-2 items-center">
          {/* Barra de progresso */}

        </div>
        <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-1 w-full overflow-auto bg-stone-800 select-none">
          {data && data.photos.length > 0 && data.photos.map((photo: any, index: number) => {
            const isSelected = selectedPhotos.includes(photo.presignedUrl);
            return (
              <div
                key={index}
                className="mb-1 break-inside-avoid cursor-pointer relative"
                onClick={() => handleSelectPhoto(photo.presignedUrl)}
              >
                <div
                  className={`absolute top-1/2 left-1/2 w-[200px] z-20 
                   transform -translate-x-1/2 -translate-y-1/2 
                   opacity-0 scale-75 transition-all duration-300 ease-out
                   ${isSelected ? "opacity-100 scale-100" : ""}`}
                >
                  <VoteAgoraIcon />
                </div>
                <img
                  src={photo.presignedUrl}
                  className={`w-full object-cover`}
                  alt={`Foto ${index + 1}`}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        <button
          className={`absolute flex items-center gap-2 z-50 right-20 bottom-20 bg-stone-800 border border-white py-2 px-10 
              font-semibold rounded-md uppercase text-lg transition-all duration-300 ease-out 
              transform ${canProceed ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`}
          disabled={!canProceed}
        >
          Próximo <ArrowLongRightIcon />
        </button>
      </DialogContent>
    </Dialog>
  );
}
