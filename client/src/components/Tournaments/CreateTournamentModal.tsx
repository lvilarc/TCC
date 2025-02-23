"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UploadIcon } from "../icons/UploadIcon";
import Image from "next/image";
import { CloseIcon } from "../icons/CloseIcon";
import { LoadingIcon } from "../icons/LoadingIcon";
import { CreateTournamentRequest, useCreateTournament } from "@/hooks/Tournaments/useCreateTournament";

interface CreateTournamentModalProps {
    onClose: () => void;
}

export default function CreateTournamentModal({ onClose }: CreateTournamentModalProps) {
    const [uploadedPhoto, setUploadedPhoto] = useState<CreateTournamentRequest | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { mutate, mutateAsync, isPending, isError, isSuccess, data, error } = useCreateTournament();
    // const { mutate, mutateAsync, isPending, isError, isSuccess, data, error } = useCreateParticipation();

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

        const newTournament: CreateTournamentRequest = {
            file: imageFiles[0],
            title: "",
            description: "",
            startDate: "",
            endDate: ""
        };

        setUploadedPhoto(newTournament);
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

        const newTournament: CreateTournamentRequest = {
            file: imageFiles[0],
            title: "",
            description: "",
            startDate: "",
            endDate: ""
        };

        setUploadedPhoto(newTournament);
        setPhotoURL(URL.createObjectURL(imageFiles[0]))
    };

    const handleTitleChange = (newName: string) => {
        setUploadedPhoto(prev => prev ? { ...prev, title: newName } : null);
    };

    const handleStartDateChange = (newStartDate: string) => {
        setUploadedPhoto(prev => prev ? { ...prev, startDate: newStartDate } : null);
    };

    const handleEndDateChange = (newEndDate: string) => {
        setUploadedPhoto(prev => prev ? { ...prev, endDate: newEndDate } : null);
    };

    const handleDescriptionChange = (newDescription: string) => {
        setUploadedPhoto(prev => prev ? { ...prev, description: newDescription } : null);
    };

    const handleSubmit = async () => {
        if (!uploadedPhoto) {
            setErrorMessage("Você precisa selecionar uma foto.");
            return;
        }
        const { title, description, endDate, startDate, file } = uploadedPhoto;
        if (!title || !description || !endDate || !startDate) {
            setErrorMessage("Preencha todos os campos obrigatórios.");
            return;
        }
        try {
            const participationRequest = { title, description, endDate, startDate, file };
            await mutateAsync(participationRequest);
            onClose();
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
                    <p className='text-stone-500 font-semibold select-none text-center text-sm lg:text-base'>Arraste e solte uma foto para ser o BANNER do Torneio  ou clique para selecionar</p>
                    <p className='text-stone-400 font-medium select-none text-center text-xs'>(Apenas formatos JPEG ou JPG)</p>
                </div>
                <label htmlFor="fileInput"
                >
                    <p className="text-center text-sm lg:text-base mt-2 text-white font-semibold select-none cursor-pointer border border-stone-700 bg-stone-700 rounded px-5 py-1">Selecionar BANNER</p>
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
                    Criar um Torneio
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
                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="startDate" className="font-medium">Início</label>
                                    <input
                                       type="datetime-local"
                                        id="startDate"
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                        placeholder="Digite o título"
                                        value={uploadedPhoto.startDate}
                                        onChange={(e) => handleStartDateChange(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="endDate" className="font-medium">Fim</label>
                                    <input
                                       type="datetime-local"
                                        id="endDate"
                                        className="mt-1 p-2 border border-gray-300 rounded"
                                        placeholder="Digite o título"
                                        value={uploadedPhoto.endDate}
                                        onChange={(e) => handleEndDateChange(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="title" className="font-medium">Título</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="Digite o título"
                                    value={uploadedPhoto.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="location" className="font-medium">Descrição</label>
                                <input
                                    type="text"
                                    id="description"
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="Digite a descrição"
                                    value={uploadedPhoto.description}
                                    onChange={(e) => handleDescriptionChange(e.target.value)}
                                />
                            </div>
                            <div className="w-full flex justify-end mt-10">
                                <button
                                    disabled={isPending}
                                    className="bg-black min-w-[250px] px-4 py-2 text-white rounded-md font-medium flex justify-center items-center"
                                    onClick={handleSubmit}
                                >{isPending ? <LoadingIcon size={6} /> : 'Criar Torneio'}</button>
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