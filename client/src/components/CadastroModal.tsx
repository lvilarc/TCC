import { useState } from "react";
import { CloseIcon } from "./icons/CloseIcon";
import { ArrowLongRightIcon } from "./icons/ArrowRightIcon";

interface CadastroModalProps {
    onClose: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CadastroModal: React.FC<CadastroModalProps> = ({ onClose }) => {
    const [showExtraFields, setShowExtraFields] = useState(false);
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [emailError, setEmailError] = useState("");

    const handleNextStep = () => {
        if (!email.trim()) {
            setEmailError("O e-mail é obrigatório.");
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError("Por favor, insira um e-mail válido.");
            return;
        }
        setEmailError("");
        setShowExtraFields(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, fullName, password });
        onClose();
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={onClose}>
                    <CloseIcon />
                </button>

                <h2 className="text-2xl font-bold mb-4">Bem-vindo ao BrasilShots</h2>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            placeholder="Digite seu e-mail"
                            required
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    {showExtraFields && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm font-medium">Nome Completo</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="Digite seu nome completo"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="Crie uma senha"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-medium">Nome de usuário</label>
                                <input
                                    type="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                                    placeholder="Crie uma nome de usuário"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {!showExtraFields ? (
                        <button
                            type="button"
                            className="text-white font-medium bg-black hover:bg-opacity-90 px-4 py-2 rounded-md mt-2 flex items-center gap-2 justify-center"
                            onClick={handleNextStep}
                        >
                            Próximo <ArrowLongRightIcon />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="text-white font-medium bg-black hover:bg-opacity-90 px-4 py-2 rounded-md mt-2 flex items-center gap-2 justify-center"
                        >
                            Criar Conta
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CadastroModal;
