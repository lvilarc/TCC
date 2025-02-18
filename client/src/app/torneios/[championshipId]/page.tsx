"use client"

import VoteModal from "@/components/VoteModal";
import { useState } from "react";

export default function Championship() {
  const jogo = {
    id: 1,
    title: "Arte Urbana",
    imageSrc:
      "https://agenciamural.org.br/wp-content/uploads/2018/11/Foto-Rafael-Magalh%C3%A3es-1024x401.jpg",
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <VoteModal open={open} setOpen={setOpen} />}
      <div className="w-full h-full">
        <div className=" flex flex-col gap-6 items-center justify-center">
          <p className="text-3xl font-bold">{jogo.title}</p>
          <div className="w-1/2 h-1/3 bg-gray-200">
            <img src={jogo.imageSrc} alt={jogo.title} />
          </div>
          <span className="py-4 w-1/2">
            As ruas são telas, e a cidade é a galeria a céu aberto. No tema Arte
            Urbana, buscamos capturar a criatividade que transforma muros, becos
            e fachadas em verdadeiras obras-primas. Grafites vibrantes, stickers
            curiosos, lambe-lambes cheios de atitude e até intervenções
            inesperadas – tudo vale, desde que conte uma história visual
            impactante. Aqui, a lente vira um portal para a cultura urbana,
            destacando cores, texturas e mensagens escondidas no concreto da
            cidade. Enquadre, clique e mostre o que faz da arte de rua um
            espetáculo único!
          </span>
          <div className="flex flex-row w-1/2 p-2 justify-between">
            <button
              onClick={() => setOpen(true)}
              className="w-1/4 p-2 bg-black text-white rounded-md"
            >
              Votar
            </button>
            <button className="w-1/4 p-2 bg-black text-white rounded-md">
              Participar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
