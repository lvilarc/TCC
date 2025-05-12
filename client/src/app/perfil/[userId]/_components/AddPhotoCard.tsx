"use client"

import { useState } from "react";
import AddPhotoModal from "./AddPhotoModal";
import { useUploadFeedPhoto } from "@/hooks/User/useUploadFeedPhoto";

export default function AddPhotoCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const uploadPhoto  = useUploadFeedPhoto();

    const handlePhotoUpload = async (file: File) => {
      try {
        const result = await uploadPhoto.mutateAsync({ file })
        console.log("Upload feito com sucesso:", result)
        setIsModalOpen(false)
      } catch (error) {
        console.error("Erro ao enviar foto:", error)
        alert("Erro ao enviar foto. Verifique o console.")
      }
    }

    return (
        <>
            <div className="bg-stone-200/20 border border-stone-200 p-6 rounded-lg text-center h-96 w-96 flex justify-center items-center flex-col">
                <div className="bg-stone-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 select-none">
                    <div className="bg-stone-800 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <span>+</span>
                    </div>
                </div>
                <button 
                    className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold py-2 px-4 rounded-full mb-4"
                    onClick={() => setIsModalOpen(true)}
                >
                    Adicionar foto
                </button>
            </div>

            {isModalOpen && (
                <AddPhotoModal 
                    onClose={() => setIsModalOpen(false)} 
                    onPhotoUpload={handlePhotoUpload} 
                />
            )}
        </>
    );
}