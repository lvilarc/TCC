"use client";

import VoteModal from "@/components/VoteModal";
import { useTournament } from "@/hooks/Tournaments/useTournament";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function Tournament() {
  const jogo = {
    id: 1,
    title: "Arte Urbana",
    imageSrc:
      "https://agenciamural.org.br/wp-content/uploads/2018/11/Foto-Rafael-Magalh%C3%A3es-1024x401.jpg",
  };

  const [open, setOpen] = useState(false);

  const { id } = useParams();

  const { data, isLoading, isError } = useTournament(Number(id));

  if (isLoading) {
    return <div>Carregando torneios...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar torneios</div>;
  }

  return (
    <>
      {open && <VoteModal open={open} setOpen={setOpen} />}
      <div className="w-full h-full">
        <div className=" flex flex-col gap-6 items-center justify-center">
          <p className="text-3xl font-bold">{data?.title}</p>
          <div className="w-1/2 h-1/3 bg-gray-200">
            <img src={jogo.imageSrc} alt={data?.title} />
          </div>
          <span className="py-4 w-1/2">{data?.description}</span>
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
