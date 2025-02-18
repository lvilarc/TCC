import React, { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

type VoteModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function VoteModal({ open, setOpen }: VoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()} // Impede o clique dentro do modal de fechá-lo
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Meu Modal</h2>
            <p>Conteúdo do modal aqui!</p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
