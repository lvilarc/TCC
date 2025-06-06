import { useState } from "react";
import { CloseIcon } from "./icons/CloseIcon";
import { ArrowLongRightIcon } from "./icons/ArrowRightIcon";
import { SignUpRequest, useSignUp } from "@/hooks/Auth/useSignUp";
import { jwtDecode } from "jwt-decode";
import { useAuthContext } from "@/hooks/AuthContext/useAuthContext";
import { User } from "@/types/User";
import { JwtPayload } from "@/types/JwtPayload";
import Cookies from 'js-cookie';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface CadastroModalProps {
    onClose: () => void;
    openLogin: () => void;
}

const CadastroModal: React.FC<CadastroModalProps> = ({ onClose, openLogin }) => {
    const { setUserFromToken } = useAuthContext();
    const { isPending, data, isSuccess, mutateAsync } = useSignUp();
    const [showExtraFields, setShowExtraFields] = useState(false);
    const [formData, setFormData] = useState<SignUpRequest>({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleNextStep = () => {
        const emailInput = document.getElementById("email") as HTMLInputElement;

        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }
        setShowExtraFields(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await mutateAsync(formData);
            const token = response.token;
            setUserFromToken(token)
            Cookies.set('token', token, { expires: 7 });
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !showExtraFields) {
            e.preventDefault(); 
            handleNextStep();   
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Bem-vindo(a) ao LentesBrasileiras</DialogTitle>
                    <DialogDescription>
                        Cadastre-se agora e explore o fascinante universo da fotografia!
                    </DialogDescription>
                </DialogHeader>
                <div className="bg-white w-full relative mt-2">
                    {/* <h2 className="text-2xl font-bold mb-6">Bem-vindo(a) ao LentesBrasileiras</h2> */}
                    <form className="flex flex-col"
                        onSubmit={(e) => {
                            if (!showExtraFields) {
                                e.preventDefault();
                                handleNextStep();
                            } else {
                                handleSubmit(e)
                            }
                        }}
                        onKeyDown={handleKeyPress}
                    >
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                placeholder="Digite seu e-mail"
                                required
                            />
                        </div>

                        {showExtraFields && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium">Nome Completo</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
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
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                                        placeholder="Crie uma senha"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-sm font-medium">Nome de usuário</label>
                                    <div className="mt-1 flex items-center relative">
                                        <input
                                            type="username"
                                            id="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded w-full pl-[26px]"
                                            required
                                        />
                                        <span className="text-gray-400 absolute left-2 select-none mb-[2px]">@</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {!showExtraFields ? (
                            <div className="flex flex-col">
                                <button
                                    type="button"
                                    className="text-white font-medium select-none bg-black hover:bg-opacity-90 px-4 py-2 rounded-md mt-2 flex items-center gap-2 justify-center"
                                    onClick={handleNextStep}
                                >
                                    Próximo <ArrowLongRightIcon />
                                </button>
                                <div className="flex text-xs font-medium gap-2 justify-center mt-4">
                                    <p>Já tem uma conta?</p>
                                    <button className="underline text-blue-500 select-none"
                                        onClick={openLogin}
                                    >Fazer login</button>
                                </div>
                            </div>
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
            </DialogContent>
        </Dialog>
    );
};

export default CadastroModal;
