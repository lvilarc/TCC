"use client"

import TournamentCard from "@/components/TournamentCard";
import CreateTournamentModal from "@/components/Tournaments/CreateTournamentModal";
import { useTournaments } from "@/hooks/Tournaments/useTournaments";
import { BoxSelectIcon, CheckIcon, ChevronDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




const options = [
    "Minhas participações",
    "Todos",
    "Início em breve",
    "Abertos",
    "Votação - Etapa 1",
    "Votação - Etapa 2",
    "Encerrados"
];

export default function TournamentsPage() {
    const [selected, setSelected] = useState(options[0]);
    const { data, isLoading, isError } = useTournaments();
    const [createTournamentModal, setCreateTournamentModal] = useState(false);
    if (isLoading) {
        return <div>Carregando torneios...</div>;
    }

    if (isError) {
        return <div>Erro ao carregar torneios</div>;
    }

    return (
        <>
            {createTournamentModal && (
                <CreateTournamentModal onClose={() => setCreateTournamentModal(false)} />
            )}
            <div className="w-full">
                <div className="fixed w-full h-[70px] top-[69px] bg-black bg-opacity-50 z-40 backdrop-blur-lg">
                    <div className="flex justify-center items-center h-full text-sm gap-10">
                        <span className="text-white uppercase text-lg font-semibold">Torneios</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div id="dropdown-trigger" className="text-white flex items-center border-stone-400 font-semibold cursor-default gap-1 border pl-5 pr-3 py-1 rounded-md ">
                                    {selected} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ minWidth: document.getElementById("dropdown-trigger")?.offsetWidth }}>
                                <DropdownMenuGroup>
                                    {options.map((option) => (
                                        <DropdownMenuItem
                                            key={option}
                                            onClick={() => setSelected(option)}
                                            className={`flex items-center justify-between ${selected === option ? "bg-stone-200" : "hover:bg-stone-200"} transition-colors`}
                                        >
                                            {option}
                                            {selected === option && <CheckIcon className="w-4 h-4 text-black" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button className="fixed right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                            onClick={() => setCreateTournamentModal(true)}
                        ><PlusIcon /></button>
                    </div>

                </div>
                <div className="w-full flex justify-center mt-20">
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
        </>
    );
}