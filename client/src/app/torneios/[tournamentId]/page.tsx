"use client";

import VoteModal from "@/components/VoteModal";
import { useTournament } from "@/hooks/Tournaments/useTournament";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JoinTournamentModal from "@/components/Tournaments/JoinTournamentModal";
import Image from "next/image";
import { useStartVoting } from "@/hooks/Vote/useStartVoting";

export default function TournamentPage() {
  const jogo = {
    id: 1,
    title: "Arte Urbana",
    imageSrc:
      "https://agenciamural.org.br/wp-content/uploads/2018/11/Foto-Rafael-Magalh%C3%A3es-1024x401.jpg",
  };

  const [open, setOpen] = useState(false);
  const [joinTournamentModal, setJoinTournamentModal] = useState(false);

  const { tournamentId } = useParams();

  const { data, isLoading, isError } = useTournament(Number(tournamentId));
  const { data: startVotingData, refetch } = useStartVoting(Number(tournamentId));

  useEffect(() => {
    console.log('startVotingData', startVotingData)
  }, [startVotingData])

  if (isLoading) {
    return <div>Carregando torneios...</div>;
  }

  if (isError) {
    return <div>Erro ao carregar torneios</div>;
  }

  return (
    <>
      {joinTournamentModal && (
        <JoinTournamentModal onClose={() => setJoinTournamentModal(false)} tournamentId={Number(tournamentId)} />
      )}
      {open && <VoteModal onClose={() => setOpen(false)} data={startVotingData} />}
      <div className="w-full h-full">
        <div className=" flex flex-col gap-6 items-center justify-center">
          <p className="text-3xl font-bold">{data?.title}</p>
          <div className="w-full max-w-[1000px] h-[500px] relative">
            <Image
              src={String(data?.bannerUrl)} // Coloque o caminho ou URL da sua imagem
              layout="fill" // Preenche o espaço da div
              objectFit="cover" // Garante que a imagem cubra o espaço sem distorcer
              alt="Descrição da imagem"
            />
          </div>
          <span className="py-4 w-1/2">{data?.description}</span>
          <div className="flex flex-row w-1/2 p-2 justify-between">
            <button
              // onClick={() => setOpen(true)}
              onClick={() => { refetch(); setOpen(true); }}
              className="w-1/4 p-2 bg-black text-white rounded-md"
            >
              Votar
            </button>
            <button className="w-1/4 p-2 bg-black text-white rounded-md"
              onClick={() => setJoinTournamentModal(true)}
            >
              Participar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
