"use client"

import { useState } from "react";
import Image from "next/image";
import { UploadIcon } from "@/components/icons/UploadIcon";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LoadingIcon } from "@/components/icons/LoadingIcon";

interface AddPhotoModalProps {
    onClose: () => void;
    onPhotoUpload: (file: File) => void;
}

export default function AddPhotoModal({ onClose, onPhotoUpload }: AddPhotoModalProps) {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

        const imageFiles = files.filter(file =>
            file.type === "image/jpeg" || 
            file.type === "image/jpg" || 
            file.type === "image/png"
        );

        if (imageFiles.length === 0) {
            setErrorMessage("Somente arquivos JPG, JPEG ou PNG são permitidos.");
            return;
        }

        if (imageFiles.length > 1) {
            setErrorMessage("Você só pode enviar uma única foto.");
            return;
        }

        setErrorMessage(null);
        setPhotoFile(imageFiles[0]);
        setPhotoURL(URL.createObjectURL(imageFiles[0]));
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        const imageFiles = fileArray.filter(file =>
            file.type === "image/jpeg" || 
            file.type === "image/jpg" || 
            file.type === "image/png"
        );

        if (imageFiles.length === 0) {
            setErrorMessage("Somente arquivos JPG, JPEG ou PNG são permitidos.");
            return;
        }

        if (imageFiles.length > 1) {
            setErrorMessage("Você só pode enviar uma única foto.");
            return;
        }

        setErrorMessage(null);
        setPhotoFile(imageFiles[0]);
        setPhotoURL(URL.createObjectURL(imageFiles[0]));
    };

    const handleSubmit = async () => {
        if (!photoFile) {
            setErrorMessage("Você precisa selecionar uma foto.");
            return;
        }
        
        setIsLoading(true);
        try {
            await onPhotoUpload(photoFile);
            onClose();
        } catch (error) {
            setErrorMessage("Ocorreu um erro ao enviar a foto.");
        } finally {
            setIsLoading(false);
        }
    }

    const UploadFileDiv = () => {
        return (
            <div
                className={`w-full h-full p-1 border-dashed border-2 border-stone-400 flex flex-col justify-center items-center space-y-6 ${dragging ? 'border-sky-600' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-stone-500">
                    <UploadIcon />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <p className='text-stone-500 font-semibold select-none text-center text-sm lg:text-base'>Arraste e solte uma foto ou clique para selecionar</p>
                    <p className='text-stone-400 font-medium select-none text-center text-xs'>(Formatos: JPEG, JPG ou PNG)</p>
                </div>
                <label htmlFor="fileInput">
                    <p className="text-center text-sm lg:text-base mt-2 text-white font-semibold select-none cursor-pointer border border-stone-700 bg-stone-700 rounded px-5 py-1">Selecionar foto</p>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/jpeg, image/jpg, image/png"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </label>
                {errorMessage && <p className="text-red-500 font-medium flex text-sm items-center gap-2">{errorMessage}</p>}
            </div>
        )
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] h-[60%] flex flex-col">
                <DialogTitle>
                    Adicionar foto
                </DialogTitle>
                {photoFile && photoURL ? (
                    <div className="w-full h-full flex flex-col items-center">
                        <div className="relative flex justify-center items-center h-full w-full bg-white">
                            <Image
                                src={photoURL}
                                alt={"Foto selecionada"}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-md"
                            />
                        </div>
                        <div className="w-full flex justify-end mt-4">
                            <button
                                disabled={isLoading}
                                className="bg-black min-w-[150px] px-4 py-2 text-white rounded-md font-medium flex justify-center items-center"
                                onClick={handleSubmit}
                            >
                                {isLoading ? <LoadingIcon size={6} /> : 'Publicar foto'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <UploadFileDiv />
                )}
            </DialogContent>
        </Dialog>
    )
}