import Link from "next/link";
import Image from "next/image";
import { VoteAgoraIcon } from "./icons/VoteAgoraIcon";

interface Tournament {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerUrl: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  phase: 1 | 2 | 3 | 4 | 5;
  midDate: string;
}

export const phaseNames: Record<Tournament['phase'], string> = {
  1: 'Início em breve',
  2: 'Aberto',
  3: 'Votação Etapa 1',
  4: 'Votação Etapa 2',
  5: 'Encerrado',
};

export const phaseColors: Record<Tournament['phase'], string> = {
  1: 'bg-stone-500',
  2: 'bg-emerald-600',
  3: 'bg-indigo-600',
  4: 'bg-indigo-700',
  5: 'bg-red-600',
};

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Link href={`torneios/${tournament.id}`}>
      <div className="w-[490px] overflow-hidden shadow-md relative border border-transparent hover:border-transparent transition-colors">
        <div className="pl-4 pr-5 py-2 rounded-br-3xl bg-stone-800 text-white text-center absolute z-20 shadow-md">
          <h2 className="text-lg font-bold">{tournament.title}</h2>
        </div>
        <div className={`${phaseColors[tournament.phase]} pl-4 pr-5 py-1 rounded-tl-3xl rounded-bl text-white text-center bottom-0 right-0 absolute z-20 shadow-md`}>
          <h2 className="text-lg font-semibold">{phaseNames[tournament.phase]}</h2>
        </div>
        {tournament.phase === 3 || tournament.phase === 4 ? (
          <div className="absolute right-2 top-2 w-[140px] z-20">
            <VoteAgoraIcon />
          </div>
        ) : null}
        <div className="w-full h-[245px] relative">
          <Image
            src={tournament.bannerUrl}
            layout="fill" 
            objectFit="cover" 
            alt="Descrição da imagem"
          />
        </div>
      </div>
    </Link>
  );
}