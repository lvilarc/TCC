import fetchWithToken from "@/utils/fetchWithToken";
import { useQuery } from "@tanstack/react-query";

// Tipos para a resposta da API
export interface UserTournamentParticipation {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  phase: number;
  bannerUrl: string | null;
  participation: {
    photoId: number;
    photoTitle: string | null;
    photoUrl: string | null;
    points: number;
    position: number;
  };
}

const fetchUserTournaments = async ({
  queryKey,
}: {
  queryKey: [string, number];
}): Promise<UserTournamentParticipation[]> => {
  const [, userId] = queryKey;
  const response = await fetchWithToken(`/users/${userId}/tournaments`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${await response.text()}`);
  }

  return response.json();
};

export function useUserTournaments(userId: number | undefined) {
  const {
    data: tournaments,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["userTournaments", userId ?? 0] as const,
    queryFn: fetchUserTournaments,
    enabled: !!userId, // Só executa se o userId for válido
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  return {
    tournaments,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
  };
}