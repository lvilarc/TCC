import Link from "next/link";
import Image from "next/image";
import { VoteAgoraIcon } from "./icons/VoteAgoraIcon";

// Interface Tournament com os dados fornecidos
interface Tournament {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerUrl: string;
  // maxPhotos: number;
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
      {/* Card */}
      <div className="w-[490px] overflow-hidden shadow-md relative border border-transparent hover:border-transparent transition-colors">
        <div className="pl-4 pr-5 py-2 rounded-br-3xl bg-stone-800 text-white text-center absolute z-20">
          <h2 className="text-lg font-bold">{tournament.title}</h2>
          {/* <div
            className="absolute top-0 right-[-24px] w-6 h-full bg-stone-800"
            style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
          /> */}
        </div>
        {tournament.phase === 3 || tournament.phase === 4 ? (
          <div className="absolute right-2 top-2 w-[140px] z-20">
            <VoteAgoraIcon />
          </div>
        ) : null}
        {/* Imagem (placeholder para o momento) */}
        {/* <div className="w-full h-64 bg-stone-300" /> */}
        <div className="w-full h-64 relative">
          <Image
            src={tournament.bannerUrl} // Coloque o caminho ou URL da sua imagem
            layout="fill" // Preenche o espaço da div
            objectFit="cover" // Garante que a imagem cubra o espaço sem distorcer
            alt="Descrição da imagem"
          />
        </div>
        {/* Título */}
        <div className="flex justify-around text-center w-full bg-stone-800 text-white gap-4">
          <div className="flex flex-col items-center justify-center font-semibold bg-stone-800 text-white px-4 pt-2 pb-3 uppercase">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium">máx</span>
              {/* <span className="text-xl">{tournament.maxPhotos}</span> */}
            </div>
            <span className="text-xs font-medium">fotos</span>
          </div>
          <div className={`flex-grow text-white text-base flex justify-center items-center font-semibold text-center `}>
            <span className={`${phaseColors[tournament.phase]} py-1.5 rounded px-4 flex justify-center items-center text-base`}> {phaseNames[tournament.phase]}</span>
          </div>
          <div className="flex flex-col items-center justify-center font-semibold px-4">
            <span>10.000</span>
            <span>votantes</span>
          </div>
        </div>
        {/* Descrição */}
        {/* <div className="p-4 bg-stone-50 text-stone-800"> */}
          {/* <p className="text-sm font-medium">{tournament.description}</p> */}
          {/* <div className="mt-2 text-sm text-gray-600">
            <p><strong>Votação 1/2:</strong> {new Date(tournament.startDate).toLocaleDateString()} até { new Date(tournament.midDate).toLocaleDateString() }</p>
            <p><strong>Votação 2/2:</strong> { new Date(tournament.midDate).toLocaleDateString() } até {new Date(tournament.endDate).toLocaleDateString()}</p>
            <p><strong>Fim do torneio:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
            <p><strong>Máximo de Fotos:</strong> {tournament.maxPhotos}</p>

          </div> */}
        {/* </div> */}
      </div>
    </Link>
  );
}
