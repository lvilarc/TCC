"use client"

import TournamentCard from "@/components/TournamentCard";
import CreateTournamentModal from "@/components/Tournaments/CreateTournamentModal";
import { useTournaments } from "@/hooks/Tournaments/useTournaments";
import { CheckIcon, ChevronDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/hooks/AuthContext/useAuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


const filterOptions = [
    { label: "Minhas participações", value: "myParticipations" },
    { label: "Todos", value: "all" },
    { label: "Início em breve", value: "upcoming" },
    { label: "Abertos", value: "open" },
    { label: "Votação", value: "voting" },
    { label: "Encerrados", value: "closed" }
];

export default function TournamentsPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    const filteredFilterOptions = user
        ? filterOptions
        : filterOptions.filter(option => option.value !== "myParticipations");

    const filterFromUrl = searchParams.get('filter') || 'all';
    let validatedFilter = filterOptions.some(opt => opt.value === filterFromUrl) ? filterFromUrl : 'all';

    useEffect(() => {
        if (!user && validatedFilter === 'myParticipations') {
            const newParams = new URLSearchParams();
            newParams.set('filter', 'all'); // Define 'all' como padrão

            router.replace(`?${newParams.toString()}`);
        }
    }, [user, validatedFilter, router]);

    const initialFilter = filterOptions.find(opt => opt.value === validatedFilter) || filterOptions[1];
    const [selected, setSelected] = useState(initialFilter);
    const { data, isLoading, isError } = useTournaments({ filter: selected.value });
    const [createTournamentModal, setCreateTournamentModal] = useState(false);

    useEffect(() => {
        if (selected.value !== validatedFilter) {
            const newParams = new URLSearchParams();
            newParams.set('filter', selected.value);
            router.replace(`?${newParams.toString()}`);
        }
    }, [selected, router]);



    if (isError) {
        return <div>Erro ao carregar torneios</div>;
    }

    return (
        <>
            {createTournamentModal && (
                <CreateTournamentModal onClose={() => setCreateTournamentModal(false)} />
            )}
            <div className="w-full pb-10">
                <div className="fixed w-full h-[70px] top-[69px] bg-black bg-opacity-50 z-40 backdrop-blur-lg">
                    <div className="flex justify-center items-center h-full text-sm gap-10">
                        <span className="text-white uppercase text-lg font-semibold">Torneios</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div id="dropdown-trigger" className="text-white flex items-center border-stone-400 font-semibold cursor-default gap-1 border pl-5 pr-3 py-1 rounded-md ">
                                    {selected.label} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" style={{ minWidth: document.getElementById("dropdown-trigger")?.offsetWidth }}>
                                <DropdownMenuGroup>
                                    {filteredFilterOptions.map((option) => (
                                        <DropdownMenuItem
                                            key={option.label}
                                            onClick={() => setSelected(option)}
                                            className={`flex items-center justify-between ${selected.label === option.label ? "bg-stone-200" : "hover:bg-stone-200"} transition-colors`}
                                        >
                                            {option.label}
                                            {selected.label === option.label && <CheckIcon className="w-4 h-4 text-black" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {user && (user.username == "lvilarc" || user.username == "beventura") ? (
                            <button className="fixed right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                                onClick={() => setCreateTournamentModal(true)}
                            ><PlusIcon /></button>
                        ) : null}
                    </div>
                </div>
                <div className="w-full flex justify-center mt-20">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <Skeleton key={index} className="h-[245px] w-[488px] rounded-none" />
                            ))}
                        </div>
                    ) : data?.length > 0 ? (
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