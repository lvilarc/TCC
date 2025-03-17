import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VoteAgoraIcon } from "./icons/VoteAgoraIcon";

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

type VoteModalProps = {
  onClose: () => void;
  data: {
    method: keyof typeof VotingMethods;
    photos: any[];
  };
};

export default function VoteModal({ onClose, data }: VoteModalProps) {
  // Inicializar o estado de seleção de fotos
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Obter as regras do método de votação
  const method = data?.method;
  const methodRules = VotingMethods[method];

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

  // Definir o título com base no método de votação
  const title = methodRules ? methodRules.label : "Votação";
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[98vw] h-[94vh] flex flex-col bg-stone-800 text-white`}>
        <DialogTitle className="text-2xl">
          {title}
        </DialogTitle>
        <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-1 w-full overflow-auto bg-stone-800">
          {data && data.photos.length > 0 && data.photos.map((photo: any, index: number) => {
            const isSelected = selectedPhotos.includes(photo.presignedUrl);
            return (
              <div
                key={index}
                className="mb-1 break-inside-avoid cursor-pointer relative"
                onClick={() => handleSelectPhoto(photo.presignedUrl)}
              >
                {isSelected ? (
                  <div className="absolute top-1/2 left-1/2 w-[200px] z-20 transform -translate-x-1/2 -translate-y-1/2">
                    <VoteAgoraIcon />
                  </div>
                ) : null}
                <img
                  src={photo.presignedUrl}
                  className={`w-full object-cover`}
                  alt={`Foto ${index + 1}`}
                />
              </div>
            );
          })}
        </div>
        <button className="absolute right-20 bottom-20 bg-stone-800 border border-white py-2 px-10 font-semibold rounded-md uppercase text-lg">
          Próximo
        </button>
      </DialogContent>
    </Dialog>
  );
}
