import { Tournament } from "@/types/Tournament";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const fetchTournament = async ({
  queryKey,
}: {
  queryKey: [string, number];
}): Promise<Tournament> => {
  const [, id] = queryKey;
  const response = await fetch(`${API_URL}/tournaments/${id}`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export function useTournament(id: number) {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["tournament", id] as const, // 🔥 Simples e direto
    queryFn: fetchTournament,
    enabled: !!id, // Só executa se o ID for válido
  });

  return { data, error, isLoading, isError };
}
