"use client";

import { useState, useRef } from "react";
import { Camera, X, Check } from "lucide-react";
import Image from "next/image";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { UploadIcon } from "./icons/UploadIcon";
import "react-image-crop/dist/ReactCrop.css";
import { useUploadProfilePhoto } from "@/hooks/User/useUploadProfilePhoto";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

interface UploadProfilePhotoModalProps {
  onClose: () => void;
  currentPhotoUrl?: string;
}

export default function UploadProfilePhotoModal({ 
  onClose,
  currentPhotoUrl 
}: UploadProfilePhotoModalProps) {
  const { mutateAsync: uploadProfilePhoto, isPending: isUploading } = useUploadProfilePhoto();
  const [dragging, setDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setErrorMessage("Somente arquivos JPG, JPEG ou PNG são permitidos.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("O arquivo deve ter no máximo 5MB.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || null);
      setCrop(undefined);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const handleUpload = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;
    
    try {
      // Cria a imagem recortada
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
      
      // Converte para File
      const file = new File([croppedImageBlob], "profile-photo.jpg", { 
        type: 'image/jpeg' 
      });
      
      // Usa o hook para fazer o upload
      await uploadProfilePhoto({ file });
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao processar a imagem. Tente novamente.");
    }
  };

  const removePreview = () => {
    setImgSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error('Canvas is empty');
          resolve(blob);
        },
        'image/jpeg',
        0.9
      );
    });
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle className="flex items-center gap-2">
          <Camera size={20} />
          {imgSrc ? "Recortar foto de perfil" : "Atualizar foto de perfil"}
        </DialogTitle>
        
        <div className="flex flex-col items-center gap-6">
          {imgSrc ? (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="relative w-full max-h-[300px] overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  minWidth={100}
                  minHeight={100}
                  ruleOfThirds
                  className="w-full"
                >
                  <Image
                    ref={imgRef}
                    src={imgSrc}
                    alt="Imagem para recortar"
                    width={500}
                    height={300}
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>

              <canvas
                ref={previewCanvasRef}
                className="hidden"
                style={{
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop?.width,
                  height: completedCrop?.height,
                }}
              />

              <div className="flex gap-4 w-full justify-between">
                <button
                  onClick={removePreview}
                  className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  <X size={16} /> Trocar imagem
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || !completedCrop}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
                >
                  {isUploading ? (
                    "Salvando..."
                  ) : (
                    <>
                      <Check size={16} /> Confirmar
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`w-full h-64 p-1 border-dashed border-2 rounded-lg ${
                dragging ? 'border-sky-600' : 'border-stone-400'
              } flex flex-col justify-center items-center space-y-6`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-stone-500">
                <UploadIcon />
              </div>
              <div className="text-center text-sm text-stone-500 font-semibold">
                Arraste uma imagem ou clique abaixo
              </div>
              <label className="cursor-pointer border border-stone-700 bg-stone-700 text-white rounded px-4 py-1 mt-2">
                Selecionar Imagem
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileInputChange}
                />
              </label>
            </div>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}