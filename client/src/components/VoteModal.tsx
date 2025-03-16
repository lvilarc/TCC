import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";

type VoteModalProps = {
  onClose: () => void;
  data: any;
};

export default function VoteModal({ onClose, data }: VoteModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[90vw] h-[90%] flex flex-col`}>
        <DialogTitle>
          Votação
        </DialogTitle>
        <div className="flex flex-wrap gap-4 justify-center overflow-auto h-full">
          {data && data.photos.length > 0 && data.photos.map((photo: any, index: number) => (
            <div key={index} className="relative w-[calc(33.33%-1rem)] h-[200px] mb-4"> {/* Tamanho da imagem controlado */}
              <Image
                src={photo.presignedUrl}
                alt={`foto ${index}`}
                layout="responsive" // Ajusta a largura e a altura
                width={500} // Largura máxima
                height={300} // Altura máxima
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
