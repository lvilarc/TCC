"use client";

import VoteModal from "@/components/VoteModal";
import { useTournament } from "@/hooks/Tournaments/useTournament";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JoinTournamentModal from "@/components/Tournaments/JoinTournamentModal";
import Image from "next/image";
import { useStartVoting } from "@/hooks/Vote/useStartVoting";
import { useAuthContext } from "@/hooks/AuthContext/useAuthContext";
import { phaseColors, phaseNames } from "@/components/TournamentCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function TournamentPage() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [joinTournamentModal, setJoinTournamentModal] = useState(false);

  const { tournamentId } = useParams();

  const { data, isLoading, isError } = useTournament(Number(tournamentId));
  // const { data: startVotingData, refetch } = useStartVoting(Number(tournamentId));

  useEffect(() => {
    console.log('data', data)
  }, [data])

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
      {open && <VoteModal onClose={() => setOpen(false)} tournamentTitle={data?.title!} tournamentId={Number(tournamentId)} />}
      <div className="w-full h-full mt-[-12px]">
        {data ? (
          <div>
            <div className="w-full bg-stone-300 flex justify-center">
              <div className="max-w-[100vw] md:max-w-[80vw] lg:max-w-[60vw] xl:max-w-[42vw] w-full relative h-[50vw] md:h-[40vw] lg:h-[30vw] xl:h-[21vw]">
                <Image
                  src={String(data?.bannerUrl)} // Coloque o caminho ou URL da sua imagem
                  layout="fill" // Preenche o espaço da div
                  objectFit="cover" // Garante que a imagem cubra o espaço sem distorcer
                  alt="Descrição da imagem"
                  className="md:rounded shadow-md"
                />
                <div className="pl-6 pr-7 py-2 rounded-br-3xl rounded-tl bg-stone-800 text-white text-center absolute z-20 shadow-md">
                  <h2 className="text-2xl font-bold">{data?.title}</h2>
                </div>
                <div className={`${phaseColors[data.phase]} pl-6 pr-7 py-2 rounded-tr-3xl rounded-bl text-white text-center bottom-0 absolute z-20 shadow-md`}>
                  <h2 className="text-2xl font-bold">{phaseNames[data.phase]}</h2>
                </div>
              </div>
            </div>
            <div className="max-w-[100vw] md:max-w-[80vw] lg:max-w-[60vw] xl:max-w-[42vw] flex flex-col gap-6 mx-auto items-center px-2 md:px-0">
              <div className="w-full mt-6">
                <h1 className="text-lg font-semibold">Descrição do torneio:</h1>
                <span>{data?.description}</span>
                <h1 className="text-lg font-semibold mt-2">Datas:</h1>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="">Votação Etapa 1:</span>
                    <span className="text-right">{new Date(data.startDate).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Votação Etapa 2:</span>
                    <span className="text-right">{new Date(data.midDate).toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Fim do torneio:</span>
                    <span className="text-right">{new Date(data.endDate).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between w-full">
                {data.phase === 3 || data.phase === 4 ? (
                  <button
                    onClick={() => {
                      if (user) {
                        // refetch();
                        setOpen(true);
                      } else {
                        window.dispatchEvent(new CustomEvent("openLoginModal"))
                      }
                    }}
                    className="py-2 px-20 text-center font-semibold bg-black hover:bg-stone-800 text-white rounded-md"
                  >
                    Votar
                  </button>
                ) : null}
                {data.phase === 2 ? (
                  <button className="py-2 px-20 text-center font-semibold bg-black hover:bg-stone-800 text-white rounded-md"
                    onClick={() => {
                      if (user) {
                        setJoinTournamentModal(true)
                      } else {
                        window.dispatchEvent(new CustomEvent("openLoginModal"))
                      }
                    }}
                  >
                    Participar
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <Skeleton className="w-20 h-20" />
        )}
      </div>
    </>
  );
}
