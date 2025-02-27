import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const fetchUser = async ({
  queryKey,
}: {
  queryKey: [string, number];
}): Promise<User> => {
  const [, id] = queryKey;
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export function useUser(id: number) {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["user", id] as const, // 🔥 Simples e direto
    queryFn: fetchUser,
    enabled: !!id, // Só executa se o ID for válido
  });

  return { data, error, isLoading, isError };
}
