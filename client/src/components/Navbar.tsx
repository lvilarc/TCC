"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import CadastroModal from "./CadastroModal";

export default function Navbar() {
    const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
    useEffect(() => {
        if (cadastroModalOpen) {
            document.body.style.overflow = "hidden";  // Bloqueia a rolagem
        } else {
            document.body.style.overflow = "auto";  // Restaura a rolagem
        }
    }, [cadastroModalOpen]);
    return (
        <>
            {cadastroModalOpen && (
                <CadastroModal onClose={() => setCadastroModalOpen(false)} />
            )}
            <nav className="bg-stone-800 text-white py-5 flex justify-between px-10 lg:px-40 items-center fixed top-0 left-0 w-full">
                <div className="flex items-center">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white" />
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
                <div className="flex gap-6 items-center font-semibold text-sm">
                    <button>Entrar</button>
                    <button className="px-5 py-2 bg-green-600 rounded-full"
                        onClick={() => {
                            setCadastroModalOpen(true);
                        }}
                    >Criar conta</button>
                </div>
            </nav>
        </>
    );
}