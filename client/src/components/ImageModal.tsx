import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, isOpen, onClose }: ImageModalProps) => {
  // Function to close modal and restore scrolling
  const closeModal = () => {
    onClose();
    document.body.style.overflow = "auto";
  };

  // Close when clicking outside the image
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Prevent body scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={closeModal}
          className="fixed top-10 right-10 text-white text-xl font-bold p-2"
          aria-label="Close image modal"
        >
          <X size={30} />
        </button>
        <Image
          src={imageUrl}
          alt="Enlarged view"
          width={1200}
          height={1200}
          className="object-contain w-full h-full"
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        />
      </div>
    </div>
  );
};

export default ImageModal;