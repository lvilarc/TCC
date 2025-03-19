export type Tournament = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  midDate: string;
  endDate: string;
  // maxPhotos: number;
  createdBy: number;
  bannerUrl: string;
  phase: 1 | 2 | 3 | 4 | 5;
};
