"use client"

import TournamentCard from "@/components/TournamentCard";
import { useTournaments } from "@/hooks/Tournaments/useTournaments";






export default function TournamentsPage() {
    const { data, isLoading, isError } = useTournaments();
    if (isLoading) {
        return <div>Carregando torneios...</div>;
    }

    if (isError) {
        return <div>Erro ao carregar torneios</div>;
    }

    return (
        <div className="w-full">
            <div className="fixed w-full h-[70px] top-[69px] bg-black bg-opacity-50 z-40 backdrop-blur-lg">
                <div className="flex justify-center items-center h-full text-sm">
                    <button className="h-full px-6 flex justify-center items-center hover:bg-stone-300 transition-colors text-white hover:text-stone-800 uppercase">
                        Todos
                    </button>
                    <button className="h-full px-6 flex justify-center items-center hover:bg-stone-300 transition-colors text-white hover:text-stone-800 uppercase">
                        Início em breve
                    </button>
                    <button className="h-full px-6 flex justify-center items-center hover:bg-stone-300 transition-colors text-white hover:text-stone-800 uppercase">
                        Aberto
                    </button>
                    <button className="h-full px-6 flex justify-center items-center hover:bg-stone-300 transition-colors text-white hover:text-stone-800 uppercase">
                        Votação 1/2
                    </button>
                    <button className="h-full px-6 flex justify-center items-center hover:bg-stone-300 transition-colors text-white hover:text-stone-800 uppercase">
                        Votação 2/2
                    </button>
                    <button className="h-full px-6 flex justify-center items-center hover:bg-stone-300 transition-colors text-white hover:text-stone-800 uppercase">
                        Encerrado
                    </button>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-10 text-center mt-[64px]">Torneios</h1>
            <div className="w-full flex justify-center">
                {data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {data.map((tournament: any) => (
                            <TournamentCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                ) : (
                    <div>Não há torneios disponíveis.</div>
                )}
            </div>
        </div>
    );
}