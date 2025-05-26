type TournamentWinner = {
  photoId: number;
  photoTitle: string | null;
  location: string | null;
  photoUrl: string;
  user: {
    id: number;
    username: string;
    name: string;
    photographerCategory: string;
  };
  totalScore: number;
};

export type Tournament = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  midDate: string;
  endDate: string;
  preSubmissionDate: string;
  // maxPhotos: number;
  createdBy: number;
  bannerUrl: string;
  phase: 1 | 2 | 3 | 4;
    winners?: TournamentWinner[];
};
