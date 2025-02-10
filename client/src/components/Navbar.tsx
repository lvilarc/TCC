"use client"

import Cookies from 'js-cookie';
import Link from "next/link";
import { useState } from "react";
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

export default function Navbar() {
    const { user } = useAuthContext();
    const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

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
            <nav className="bg-white text-stone-800 py-4 flex justify-between px-10 lg:px-40 items-center fixed top-0 left-0 w-full border-b">
                <div className="flex items-center">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-stone-800" />
                            <span className="text-xl font-semibold">BrasilShots</span>
                        </div>
                    </Link>
                    <ul className="flex space-x-4 ml-20">
                        <li>
                            <Link href="/" className="hover:text-stone-400">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-stone-400">
                                Sobre
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-stone-400">
                                Contato
                            </Link>
                        </li>
                    </ul>
                </div>
                {user ? (
                    <div className="flex items-center gap-2">
                        <button className="whitespace-nowrap text-sm font-semibold hover:underline">@{user.username}</button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="focus:outline-none"
                                ><UserCircle size={36} /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
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
                    </div>
                ) : (
                    <div className="flex gap-6 items-center font-semibold text-sm select-none">
                        <button
                            onClick={() => {
                                setLoginModalOpen(true);
                            }}
                        >Entrar</button>
                        <button className="px-5 py-2 bg-stone-800 rounded-full text-white"
                            onClick={() => {
                                setCadastroModalOpen(true);
                            }}
                        >Criar conta</button>
                    </div>
                )}

            </nav>
        </>
    );
}