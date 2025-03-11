export interface Participation {
  id: number; // ID da participação
  userId: number; // ID do usuário
  tournamentId: number; // ID do torneio
  photoId: number; // Foto enviada para o torneio
  title?: string; // Título da foto (pode ser null)
  location?: string; // Localização da foto (pode ser null)
  createdAt: Date; // Data de criação
}
