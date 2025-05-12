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
import { LoginRequest, useLogin } from "@/hooks/Auth/useLogin";

interface LoginModalProps {
    onClose: () => void;
    openCadastro: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, openCadastro }) => {
    const { setUserFromToken } = useAuthContext();
    const { isPending, data, isSuccess, mutateAsync } = useLogin();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showRedefinirSenha, setShowRedefinirSenha] = useState(false);
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
            setShowRedefinirSenha(true);
            if (error.message) {
                if (error.message.includes("Failed to fetch")) {
                    setErrorMessage("Falha ao conectar-se ao servidor. Verifique sua conexão com a internet e tente novamente mais tarde.");
                } else {
                    setErrorMessage(error.message);
                }     
            } else {
            setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
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
                {/* <h2 className="text-2xl font-bold mb-6">Bem-vindo(a) ao LentesBrasileiras</h2> */}
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
                    {errorMessage && <p className="text-red-500 font-medium text-xs mb-2">{errorMessage}</p>}
                    <button
                        type="submit"
                        className="text-white font-medium bg-black hover:bg-opacity-90 px-4 py-2 rounded-md mt-2 flex items-center gap-2 justify-center"
                    >
                        Fazer login
                    </button>
                    {showRedefinirSenha && (
                        <div className="flex text-xs font-medium gap-2 justify-center mt-4">
                            <p>Esqueceu a senha?</p>
                            <button className="underline text-blue-500 select-none"

                            >Redefinir senha</button>
                        </div>
                    )}
                    <div className="flex text-xs font-medium gap-2 justify-center mt-4">
                        <p>Ainda não tem uma conta?</p>
                        <button className="underline text-blue-500 select-none"
                            onClick={openCadastro}
                        >Cadastre-se</button>
                    </div>
                </form>
            </div>
        </DialogContent>
    </Dialog>
);
};

export default LoginModal;
