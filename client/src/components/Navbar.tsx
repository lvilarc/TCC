"use client"

import Cookies from 'js-cookie';
import Link from "next/link";
import { useEffect, useState } from "react";
import CadastroModal from "./CadastroModal";
import { useAuthContext } from "@/hooks/AuthContext/useAuthContext";
import { UserCircle } from "./icons/UserCircle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginModal from './LoginModal';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { LentesBrasileirasLogo } from './icons/LentesBrasileirasLogo';

const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Torneios", path: "/torneios" },
    { name: "Comunidade", path: "/comunidade" },
    { name: "Sobre", path: "/sobre" },
    // { name: "Contato", path: "/contato" }
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuthContext();
    const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenLogin = () => setLoginModalOpen(true);

        window.addEventListener("openLoginModal", handleOpenLogin);

        return () => {
            window.removeEventListener("openLoginModal", handleOpenLogin);
        };
    }, []);

    return (
        <>
            {cadastroModalOpen && (
                <CadastroModal onClose={() => setCadastroModalOpen(false)} openLogin={() => {
                    setCadastroModalOpen(false);
                    setTimeout(() => {
                        setLoginModalOpen(true);
                    }, 100);
                }} />
            )}
            {loginModalOpen && (
                <LoginModal onClose={() => setLoginModalOpen(false)} openCadastro={() => {
                    setLoginModalOpen(false);
                    setTimeout(() => {
                        setCadastroModalOpen(true);
                    }, 100);
                }} />
            )}
            <nav className="bg-white text-stone-800 h-[69px] flex justify-between px-2 md:px-10 2xl:px-40 items-center fixed top-0 left-0 w-full border-b shadow-md z-50">
                <div className="flex items-center h-full">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            {/* <div className="w-6 h-6 rounded-full bg-stone-800" /> */}
                            <LentesBrasileirasLogo/>
                            <span className="text-base xl:text-xl font-semibold whitespace-nowrap">LentesBrasileiras</span>
                        </div>
                    </Link>
                    <ul className="hidden xl:flex md:ml-20 h-full items-center">
                        {menuItems.map(({ name, path }) => {
                            const isActive = pathname === path || (path === "/torneios" && pathname.startsWith("/torneios"));

                            return (
                                <li key={path} className="h-full">
                                    <Link
                                        href={path}
                                        className={`px-5 h-full flex items-center text-xs md:text-base  ${isActive ? "bg-stone-100 font-medium text-stone-800" : "text-stone-600 hover:text-stone-800"
                                            }`}
                                    >
                                        {name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {user ? (
                    <div className="flex items-center gap-2">
                        <Link href={`/perfil/${user.id}`}>
                            <div className="whitespace-nowrap text-sm font-semibold hover:underline">@{user.username}</div>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="focus:outline-none"
                                ><UserCircle size={36} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => {
                                        router.push(`/perfil/${user.id}`)
                                    }}>
                                        Meu perfil
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Configurações
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        Cookies.remove("token");
                                        window.location.reload();
                                    }}>
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Burger menu visível apenas em telas < xl */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="xl:hidden ml-2">
                                    <Menu size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 mt-2">
                                {menuItems.map(({ name, path }) => (
                                    <DropdownMenuItem key={path} onClick={() => router.push(path)}>
                                        {name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex gap-2 items-center font-semibold text-xs xl:text-sm select-none">
                        <button
                            onClick={() => {
                                setLoginModalOpen(true);
                            }}
                        >Entrar</button>
                        <button className="px-5 py-2 ml-2 bg-stone-800 rounded-full text-white whitespace-nowrap"
                            onClick={() => {
                                setCadastroModalOpen(true);
                            }}
                        >Criar conta</button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="xl:hidden ml-2">
                                    <Menu size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 mt-2">
                                {menuItems.map(({ name, path }) => (
                                    <DropdownMenuItem key={path} onClick={() => router.push(path)}>
                                        {name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

            </nav>
        </>
    );
}