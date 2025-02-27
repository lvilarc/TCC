import { Participation } from "./Participation";
import { Photo } from "./Photo";
import { Tournament } from "./Tournament";

export interface UserContext {
  id: number;
  username: string;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  passwordHash: string;
  xp: number;
  level: number;
  rank: Rank;
  photographerCategory: string;
  profilePicUrl?: string;
  coverPhotoUrl?: string;
  city?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;

  createdTournaments: Tournament[]; // Torneios criados pelo usuário
  photos: Photo[]; // Fotos enviadas pelo usuário
  participations: Participation[]; // Participações do usuário em torneios
}

export type Rank =
  | "OBSERVADOR_INICIANTE" // Níveis 0-4
  | "EXPLORADOR_DE_LENTES" // Níveis 5-9
  | "ARTISTA_DA_LUZ" // Níveis 10-14
  | "NARRADOR_VISUAL" // Níveis 15-19
  | "MESTRE_DA_COMPOSICAO" // Níveis 20-24
  | "LENDARIO_DA_FOTOGRAFIA"; // Níveis 25-30
