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
import { Award, CalendarIcon, FlagIcon, ImageIcon, ListOrdered, MapPin, Medal, Trophy, User } from "lucide-react";
import { UserCircle } from "@/components/icons/UserCircle";
import Link from "next/link";
import ImageModal from "@/components/ImageModal";

function formatHumanDate(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  let formatted = date.toLocaleDateString('pt-BR', options);

  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  formatted = formatted.replace(/, (\d{2})h(\d{2})/, ', às $1:$2');

  formatted = formatted.replace('h', 'h');

  return formatted;
}

export default function TournamentPage() {
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [joinTournamentModal, setJoinTournamentModal] = useState(false);

  const { tournamentId } = useParams();

  const { data, isLoading, isError } = useTournament(Number(tournamentId));
  // const { data: startVotingData, refetch } = useStartVoting(Number(tournamentId));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const openModal = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsModalOpen(true);
  };

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
      {/* Modal de imagem */}
      <ImageModal
        imageUrl={currentImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {open && <VoteModal onClose={() => setOpen(false)} tournamentTitle={data?.title!} tournamentId={Number(tournamentId)} />}
      <div className="w-full h-full mt-[-12px]">
        {data ? (
          <div>
            <div className="w-full bg-stone-200 flex justify-center">
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
              {/* Card de informações */}
              <div className="w-full mt-6 p-6 bg-stone-50 rounded-lg shadow-sm border border-stone-200 space-y-6">
                {/* Descrição */}
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-stone-900">Sobre o torneio</h2>
                  <p className="text-stone-700 leading-relaxed">{data?.description}</p>
                </div>

                {/* Linha divisória */}
                <div className="border-t border-stone-200"></div>

                {/* Datas */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-stone-900">Cronograma</h2>
                  <div className="flex flex-col gap-3">

                    {data.phase === 1 && (
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mr-3">
                          <CalendarIcon className="w-5 h-5 text-stone-600" />
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">Data de abertura</p>
                          <p className="text-stone-600">{formatHumanDate(data.preSubmissionDate)}</p>
                        </div>
                      </div>
                    )}

                    {data.phase <= 2 && (
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mr-3">
                          <CalendarIcon className="w-5 h-5 text-stone-600" />
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">Votação abre</p>
                          <p className="text-stone-600">{formatHumanDate(data.startDate)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mr-3">
                        <FlagIcon className="w-5 h-5 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">{data.phase === 4 ? 'Encerrado' : 'Encerramento'}</p>
                        <p className="text-stone-600">{formatHumanDate(data.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="w-full flex gap-4">
                {data.phase === 3 && (
                  <button
                    onClick={() => user ? setOpen(true) : window.dispatchEvent(new CustomEvent("openLoginModal"))}
                    className="flex-1 py-3 px-6 text-center font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-all hover:shadow-md"
                  >
                    Votar agora
                  </button>
                )}

                {data.phase === 2 && (
                  <button
                    onClick={() => user ? setJoinTournamentModal(true) : window.dispatchEvent(new CustomEvent("openLoginModal"))}
                    className="flex-1 py-3 px-6 text-center font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-all hover:shadow-md"
                  >
                    Participar do torneio
                  </button>
                )}
              </div>

              {/* Top 3 winners */}
              {data.phase === 4 && data.winners && (
                <div className="w-full p-6 mb-8 bg-stone-50 rounded-lg shadow-sm border border-stone-200">
                  <h2 className="text-2xl font-semibold text-stone-800 mb-6 flex items-center justify-center gap-3">
                    <Medal className="w-6 h-6" />
                    <span className="border-b-2 border-stone-200 pb-1 px-4">
                      Vencedores do Torneio
                    </span>
                    <Medal className="w-6 h-6" />
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.winners.slice(0, 3).map((winner, index) => (
                      <div
                        key={winner.photoId}
                        className={
                          `rounded-lg overflow-hidden shadow-lg
                          ${index === 0 ? 'border-2 border-yellow-400' : ''}
                          ${index === 1 ? 'border-2 border-gray-300' : ''}
                          ${index === 2 ? 'border-2 border-amber-600' : ''}
                        `}
                      >
                        {/* Medalha de posição */}
                        <div className="relative">
                          {index === 0 && (
                            <div className="absolute top-[4px] left-[4px] bg-yellow-400 text-stone-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10">
                              <Medal className="w-6 h-6" />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="absolute top-[4px] left-[4px] bg-gray-300 text-stone-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10">
                              <Medal className="w-6 h-6" />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="absolute top-[4px] left-[4px] bg-amber-600 text-stone-800 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10">
                              <Medal className="w-6 h-6" />
                            </div>
                          )}

                          {/* Foto vencedora */}
                          <img
                            onClick={() => openModal(winner.photoUrl)}
                            src={winner.photoUrl}
                            alt={`Foto vencedora de ${winner.user.name}`}
                            className="w-full h-64 object-cover cursor-pointer"
                          />
                        </div>

                        {/* Informações do vencedor */}
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2 gap-4">
                            <div>
                              <h3 className="text-sm font-semibold flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-stone-400" />
                                {winner.photoTitle || "Foto Sem Título"}
                              </h3>
                              {winner.location && (
                                <p className="text-stone-400 text-sm flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {winner.location}
                                </p>
                              )}
                            </div>

                            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 truncate">
                              <Award className="w-4 h-4" />
                              {winner.totalScore} pts
                            </div>
                          </div>

                          {/* Informações do autor */}
                          <div className="flex items-center mt-4 pt-4 border-t border-stone-200">
                            <Link href={`/perfil/${winner.user.id}`}>
                              <div className="flex-shrink-0 rounded-full">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                  <UserCircle size={40} />
                                </div>
                              </div>
                            </Link>
                            <Link href={`/perfil/${winner.user.id}`}>
                              <div className="ml-1">
                                <p className="text-sm font-medium">
                                  {winner.user.name}
                                </p>
                                <p className="text-xs text-stone-400">
                                  @{winner.user.username}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tabela de classificação para mais de 3 vencedores */}
                  {/* {data.winners.length > 3 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <ListOrdered className="w-5 h-5" />
                        Classificação Completa
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-stone-800 rounded-lg overflow-hidden">
                          <thead className="bg-stone-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider flex items-center gap-1">
                                <ListOrdered className="w-4 h-4" />
                                Posição
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider flex items-center gap-1">
                                <ImageIcon className="w-4 h-4" />
                                Foto
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Participante
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-stone-300 uppercase tracking-wider flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                Pontuação
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-700">
                            {data.winners.map((winner, index) => (
                              <tr key={winner.photoId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                  {index < 3 ? <Medal className={`w-4 h-4 ${index === 0 ? 'text-yellow-400' :
                                    index === 1 ? 'text-gray-300' : 'text-amber-600'
                                    }`} /> : <span className="w-4 h-4" />}
                                  {index + 1}°
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <img
                                    src={winner.photoUrl}
                                    alt={`Foto de ${winner.user.name}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                                      <User className="w-5 h-5" />
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium">
                                        {winner.user.name}
                                      </div>
                                      <div className="text-sm text-stone-400">
                                        @{winner.user.username}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-purple-600 gap-1">
                                    <Award className="w-3 h-3" />
                                    {winner.totalScore} pontos
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )} */}
                </div>
              )}
            </div>
          </div>
        ) : (
          <Skeleton className="w-20 h-20" />
        )}
      </div>
    </>
  );
}
