import { useState } from "react";

interface CadastroModalProps {
    onClose: () => void;
}

const CadastroModal: React.FC<CadastroModalProps> = ({ onClose }) => {

    return (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Criar Conta</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="Digite seu nome"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="Digite seu e-mail"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium">Senha</label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Fechar
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Criar Conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CadastroModal;
