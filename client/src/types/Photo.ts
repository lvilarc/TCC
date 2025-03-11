import { Participation } from "./Participation";

export interface Photo {
  id: number; // ID da foto
  userId: number; // ID do usuário que enviou a foto
  key: string; // Key do arquivo no S3 (identificador único do arquivo no bucket)
  url: string; // URL da foto (armazenada no S3, por exemplo)
  type: PhotoType; // Tipo da foto
  createdAt: Date;
  updatedAt: Date;
  // Relacionamento com a participação no torneio (opcional)
  participations: Participation[];
}

export type PhotoType =
  | "PROFILE_AVATAR" // Foto de perfil
  | "COVER_PHOTO" // Foto de capa do perfil
  | "PROFILE_PHOTO" // Fotos no perfil do usuário (fora de torneios)
  | "TOURNAMENT_BANNER" // Banner do Torneio
  | "TOURNAMENT_PARTICIPATION" // Foto para participar de um torneio
  | "OTHER";
