"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UploadIcon } from "../icons/UploadIcon";
import Image from "next/image";
import { CloseIcon } from "../icons/CloseIcon";


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
    const [photoURL, setPhotoURL] = useState<string | null>(null);
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
        setPhotoURL(URL.createObjectURL(imageFiles[0]))
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
        setPhotoURL(URL.createObjectURL(imageFiles[0]))
    };

    const handlePhotoTitleChange = (newName: string) => {
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
        )
    }

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`${uploadedPhoto === null ? 'sm:max-w-[800px] h-[60%]' : 'sm:max-w-[1200px] h-[90%]'} flex flex-col`}>
                <DialogTitle>
                    Participar do Torneio
                </DialogTitle>
                {uploadedPhoto && photoURL ? (
                    <div className="w-full h-full flex flex-col items-center">
                        <div className="relative flex justify-center items-center h-full w-full bg-stone-200">
                            <Image
                                src={photoURL}
                                alt={"foto"}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-md"
                            />
                            <button
                                className="absolute right-4 top-4 bg-black text-white flex justify-center items-center w-7 h-7 rounded-full"
                                onClick={() => {
                                    setUploadedPhoto(null);
                                    setPhotoURL(null);
                                }}
                            ><CloseIcon /></button>
                        </div>
                        <div className="w-full pt-4">
                            <label htmlFor="title" className="font-medium">Título da Foto</label>
                            <input
                                type="text"
                                id="title"
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                placeholder="(Opcional)"
                                value={uploadedPhoto.title}
                                onChange={(e) => handlePhotoTitleChange(e.target.value)}
                            />
                            <div className="mt-4">
                                <label htmlFor="location" className="font-medium">Local da foto</label>
                                <input
                                    type="text"
                                    id="location"
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="(Opcional)"
                                    value={uploadedPhoto.location}
                                    onChange={(e) => handlePhotoLocationChange(e.target.value)}
                                />
                            </div>
                            <div className="w-full flex justify-end mt-10">
                                <button
                                    className="bg-black min-w-[250px] px-4 py-2 text-white rounded-md font-medium"
                                >Registrar participação</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <UploadFileDiv />
                )}
            </DialogContent>
        </Dialog>
    )
}