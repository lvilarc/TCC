"use client"


import React, { useState, ReactNode, createContext, useEffect } from "react";
import Cookies from 'js-cookie';
import { User } from "@/types/User";
import { JwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    // isTokenVerified: boolean
    // setIsTokenVerified: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    // setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isSessionExpired: boolean;
    setSessionExpired: React.Dispatch<React.SetStateAction<boolean>>;
    setUserFromToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    // isTokenVerified: false,
    // setIsTokenVerified: () => { },
    user: null,
    // setUser: () => { },
    isSessionExpired: false,
    setSessionExpired: () => { },
    setUserFromToken: () => { }
});

interface ProviderProps {
    children: ReactNode;
}

export function AuthContextProvider({ children }: ProviderProps) {
    // const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isSessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => {
            Cookies.remove('token');
            setSessionExpired(true);
        };

        window.addEventListener('sessionExpired', handleSessionExpired);

        return () => {
            window.removeEventListener('sessionExpired', handleSessionExpired);
        };
    }, []);

    const decodeAndSetUser = (token: string) => {
        try {
            const payload: JwtPayload = jwtDecode(token);
            setUser({
                id: payload.sub,
                email: payload.email,
                username: payload.username,
            });
            // setIsTokenVerified(true);
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            // setIsTokenVerified(false);
        }
    };

    const setUserFromToken = (token: string) => {
        decodeAndSetUser(token);
    };

    return (
        <AuthContext.Provider
            value={{
                // isTokenVerified,
                // setIsTokenVerified,
                user,
                // setUser,
                isSessionExpired,
                setSessionExpired,
                setUserFromToken
            }}>
            {children}
        </AuthContext.Provider>
    );
}