"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UploadIcon } from "../icons/UploadIcon";


interface Photo {
    title: string;
    file: File;
    location: string;
}

interface JoinTournamentModalProps {
    onClose: () => void;
}

export default function JoinTournamentModal({ onClose }: JoinTournamentModalProps) {
    const [uploadedPhoto, setUploadedPhoto] = useState<Photo | null>(null);
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

        const imageFiles = files.filter(file =>
            file.type === "image/jpeg" || file.type === "image/jpg"
        );

        if (imageFiles.length === 0) {
            setErrorMessage("Somente arquivos JPG e JPEG são permitidos.");
            return;
        }

        if (imageFiles.length > 1) {
            setErrorMessage("Você só pode enviar uma única foto.");
            return;
        }

        setErrorMessage(null);

        const newPhoto: Photo = {
            file: imageFiles[0],
            title: "",
            location: "",
        };

        setUploadedPhoto(newPhoto);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        const imageFiles = fileArray.filter(file =>
            file.type === "image/jpeg" || file.type === "image/jpg"
        );

        if (imageFiles.length === 0) {
            setErrorMessage("Somente arquivos JPG e JPEG são permitidos.");
            return;
        }

        if (imageFiles.length > 1) {
            setErrorMessage("Você só pode enviar uma única foto.");
            return;
        }

        setErrorMessage(null);

        const newPhoto: Photo = {
            file: imageFiles[0],
            title: "",
            location: "",
        };

        setUploadedPhoto(newPhoto);
    };

    const handlePhotoNameChange = (newName: string) => {
        setUploadedPhoto(prev => prev ? { ...prev, title: newName } : null);
    };

    const handlePhotoLocationChange = (newLocation: string) => {
        setUploadedPhoto(prev => prev ? { ...prev, location: newLocation } : null);
    };

    const handleSubmit = async () => {
        if (!uploadedPhoto) {
            setErrorMessage("Você precisa selecionar uma foto.");
            return;
        }
        const { title, location } = uploadedPhoto;
        if (!title || !location) {
            setErrorMessage("Preencha todos os campos obrigatórios.");
            return;
        }
        try {

        } catch (error: any) {

        }
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[800px] h-[60%] flex flex-col">
                <DialogTitle>
                    Participar do Torneio
                </DialogTitle>
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
                        <p className='text-stone-500 font-semibold select-none text-center text-sm lg:text-base'>Arraste e solte sua foto ou clique para selecionar</p>
                        <p className='text-stone-400 font-medium select-none text-center text-xs'>(Apenas formatos JPEG ou JPG)</p>
                    </div>
                    <label htmlFor="fileInput"
                    >
                        <p className="text-center text-sm lg:text-base mt-2 text-white font-semibold select-none cursor-pointer border border-stone-700 bg-stone-700 rounded px-5 py-1">Selecionar foto</p>
                        <input
                            id="fileInput"
                            type="file"
                            accept="*"
                            onChange={handleFileInputChange}
                            className="hidden"
                        />
                    </label>
                    {errorMessage && <p className="text-red-500 font-medium flex text-sm items-center gap-2">{errorMessage}</p>}
                </div>
            </DialogContent>
        </Dialog>
    )
}