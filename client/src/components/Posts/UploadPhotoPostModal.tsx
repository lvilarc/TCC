"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UploadIcon } from "../icons/UploadIcon";

interface UploadPhotoPostModalProps {
  onClose: () => void;
  onUpload: (files: File[]) => void; // ← agora aceita múltiplos arquivos
}

export default function UploadPhotoPostModal({ onClose, onUpload }: UploadPhotoPostModalProps) {
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file =>
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    );

    if (validFiles.length === 0) {
      setErrorMessage("Somente arquivos JPG, JPEG ou PNG são permitidos.");
      return;
    }

    onUpload(validFiles); // ← envia todos os arquivos válidos de uma vez
    onClose(); // fecha o modal após upload
  };

  const UploadArea = () => (
    <div
      className={`w-full h-full p-1 border-dashed border-2 border-stone-400 flex flex-col justify-center items-center space-y-6 ${dragging ? 'border-sky-600' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-stone-500"><UploadIcon /></div>
      <div className="text-center text-sm text-stone-500 font-semibold">Arraste uma ou mais imagens ou clique abaixo</div>
      <label htmlFor="fileInput" className="cursor-pointer border border-stone-700 bg-stone-700 text-white rounded px-4 py-1 mt-2">
        Selecionar Imagens
        <input
          id="fileInput"
          type="file"
          className="hidden"
          multiple
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInputChange}
        />
      </label>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[70%] flex flex-col">
        <DialogTitle>Upload de Fotos do Post</DialogTitle>
        <UploadArea />
      </DialogContent>
    </Dialog>
  );
}
