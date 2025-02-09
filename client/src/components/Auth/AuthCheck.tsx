"use client"

import React, { useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie'; // ou o método de armazenamento preferido
import { LoadingIcon } from '../icons/LoadingIcon';
import fetchWithToken from '@/utils/fetchWithToken';
import { useAuthContext } from '@/hooks/AuthContext/useAuthContext';

interface AuthCheckProps {
    children: ReactNode;
}

const AuthCheck = ({ children }: AuthCheckProps) => {
    const { setUserFromToken } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setLoading(false);
        } else {
            fetchWithToken('/auth/validate-token', { method: 'POST' })
                .then((res) => res.json())  // Convertendo a resposta para JSON
                .then((data) => {
                    if (data.isValid) {
                        setUserFromToken(token)
                    } else {
                        Cookies.remove("token")
                    }
                })
                .catch((error) => {
                    console.error('Erro ao validar o token:', error);
                    Cookies.remove("token")
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [])

    if (loading) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <LoadingIcon size={6} />
            </div>
        )
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <>{children}</>;
};

export default AuthCheck;