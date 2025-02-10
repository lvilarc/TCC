import { useState } from "react";
import { CloseIcon } from "./icons/CloseIcon";
import { ArrowLongRightIcon } from "./icons/ArrowRightIcon";
import { SignUpRequest, useSignUp } from "@/hooks/useSignUp";
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
import { LoginRequest, useLogin } from "@/hooks/useLogin";

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
    const { setUserFromToken } = useAuthContext();
    const { isPending, data, isSuccess, mutateAsync } = useLogin();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const [showExtraFields, setShowExtraFields] = useState(false);
    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        setErrorMessage(null);
    };

    // const handleNextStep = () => {
    //     const emailInput = document.getElementById("email") as HTMLInputElement;

    //     if (!emailInput.checkValidity()) {
    //         emailInput.reportValidity();
    //         return;
    //     }
    //     setShowExtraFields(true);
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await mutateAsync(formData);
            const token = response.token;
            setUserFromToken(token)
            Cookies.set('token', token, { expires: 7 });
            onClose();
        } catch (error: any) {
            console.error("Erro ao logar:", error);
    
            if (error.message) {
                setErrorMessage(error.message); // Exibe a mensagem vinda do backend
            } else {
                setErrorMessage("Erro ao conectar ao servidor");
            }
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Entrar</DialogTitle>
                    {/* <DialogDescription>
                        Cadastre-se agora e explore o fascinante universo da fotografia!
                    </DialogDescription> */}
                </DialogHeader>
                <div className="bg-white w-full relative mt-2">
                    {/* <h2 className="text-2xl font-bold mb-6">Bem-vindo(a) ao BrasilShots</h2> */}
                    <form className="flex flex-col" onSubmit={handleSubmit}>
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
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                placeholder="Digite sua senha"
                                required
                            />
                        </div>
                        {errorMessage && <p className="text-red-500 font-medium text-sm mb-2">{errorMessage}</p>}
                        <button
                            type="submit"
                            className="text-white font-medium bg-black hover:bg-opacity-90 px-4 py-2 rounded-md mt-2 flex items-center gap-2 justify-center"
                        >
                            Fazer login
                        </button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginModal;
