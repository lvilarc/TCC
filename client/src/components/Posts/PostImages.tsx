import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@/hooks/Posts/usePosts";
import { ArrowLeft, ArrowRight, X } from "lucide-react"; // Importando os ícones de navegação e Close

const PostImages = ({ post }: { post: Post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Função para abrir o modal e impedir a rolagem da página
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Desabilitar a rolagem
  };

  // Função para fechar o modal e restaurar a rolagem
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Restaurar a rolagem
  };

  // Função para ir para a próxima imagem
  const goToNextImage = () => {
    if (currentImageIndex < post.photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Função para voltar à imagem anterior
  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Função para fechar ao clicar fora da imagem
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      {/* Exibir as fotos em miniaturas (usando grid para se ajustar dinamicamente) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[2px] rounded-xl overflow-hidden">
        {post.photos.map((photo: any, index: number) => (
          <div key={photo.id} className="flex justify-center">
            <Image
              src={photo.url}
              alt={`Foto ${index + 1}`}
              width={200} // Tamanho fixo das miniaturas
              height={200} // Tamanho fixo das miniaturas
              className="object-cover w-full h-full cursor-pointer overflow-hidden" // Mantendo as bordas arredondadas e a opção de clicar
              onClick={() => openModal(index)}
            />
          </div>
        ))}
      </div>

      {/* Modal com navegação entre as imagens */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleOverlayClick} // Fechar ao clicar fora da imagem
        >
          <div className="relative">
            <button
              onClick={closeModal}
              className="fixed top-10 right-10 text-white text-xl font-bold p-2"
            >
              <X size={30} /> {/* Ícone de fechar */}
            </button>
            <div className="relative">
              <Image
                src={post.photos[currentImageIndex].url}
                alt={`Imagem ${currentImageIndex + 1}`}
                width={800}
                height={800}
                className="object-contain w-full max-h-screen" // Limita a altura para o tamanho da tela
              />
              <div className="absolute top-1/2 left-[-50px] right-[-50px] flex justify-between">
                <button
                  onClick={goToPreviousImage}
                  className="text-white text-4xl p-2 rounded-full bg-black hover:bg-gray-700 transition"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={goToNextImage}
                  className="text-white text-4xl p-2 rounded-full bg-black hover:bg-gray-700 transition"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostImages;
